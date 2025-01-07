package handlers

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// CustomRateLimiter - Middleware za ograničavanje zahtjeva
func CustomRateLimiter(rdb *redis.Client, limit int, window time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx := context.Background()
		clientIP := c.ClientIP()

		// Redis ključ za praćenje zahtjeva
		redisKey := "rate_limiter:" + clientIP
		now := time.Now().UnixNano() / int64(time.Millisecond) // Vremenska oznaka u milisekundama

		// Dodavanje trenutnog vremena u Redis sorted set
		_, err := rdb.Pipelined(ctx, func(pipe redis.Pipeliner) error {
			pipe.ZAdd(ctx, redisKey, redis.Z{
				Score:  float64(now),
				Member: now,
			})
			pipe.Expire(ctx, redisKey, window)
			return nil
		})
		if err != nil {
			c.Status(http.StatusInternalServerError)
			c.Abort()
			return
		}

		// Dohvaćanje broja zahtjeva u zadnjem vremenskom prozoru
		windowStart := float64(now - int64(window.Milliseconds()))
		reqCount, err := rdb.ZCount(ctx, redisKey, fmt.Sprintf("%f", windowStart), fmt.Sprintf("%f", float64(now))).Result()
		if err != nil {
			c.Status(http.StatusInternalServerError)
			c.Abort()
			return
		}

		// Provjera da li je broj zahtjeva premašio limit
		if int(reqCount) > limit {
			// Dohvaćanje najstarijeg zahtjeva iz trenutnog prozora
			oldestReq, err := rdb.ZRange(ctx, redisKey, 0, 0).Result()
			if err != nil || len(oldestReq) == 0 {
				c.Status(http.StatusInternalServerError)
				c.Abort()
				return
			}

			// Izračunavanje vremena do isteka limita
			oldestTimestamp := int64(0)
			fmt.Sscanf(oldestReq[0], "%d", &oldestTimestamp)
			retryAfter := time.Duration((int64(window.Milliseconds()) - (now - oldestTimestamp))) * time.Millisecond

			// Postavljanje Retry-After zaglavlja i vraćanje samo HTTP koda 429
			c.Header("Retry-After", fmt.Sprintf("%.0f", retryAfter.Seconds()))
			c.Status(http.StatusTooManyRequests)
			c.Abort()
			return
		}

		c.Next()
	}
}
