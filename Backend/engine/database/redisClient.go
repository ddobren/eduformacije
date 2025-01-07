// database/redisClient.go

package database

import (
	"context"
	"log"

	"github.com/ddobren/eduformacije/config"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.Background()

// InitRedis - Inicijalizacija Redis klijenta
func InitRedis() {
	redisAddr := config.GetEnv("REDIS_ADDR", "127.0.0.1:6379")
	redisPassword := config.GetEnv("REDIS_PASSWORD", "")

	rdb = redis.NewClient(&redis.Options{
		Addr:     redisAddr,
		Password: redisPassword,
		DB:       0,
	})

	// Provjera konekcije s Redisom
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("Ne mogu se spojiti na Redis: %v", err)
	} else {
		log.Println("Veza s Redis uspješno uspostavljena")
	}
}

// GetRedisClient - Vraća Redis klijent
func GetRedisClient() *redis.Client {
	return rdb
}
