package database

import (
	"context"
	"log"
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/redis/go-redis/v9"
)

var rdb *redis.Client
var ctx = context.Background()

// InitRedis - Inicijalizacija Redis klijenta
func InitRedis() {
	redisAddr := config.GetEnv("REDIS_ADDR", "redis:6379")
	redisPassword := config.GetEnv("REDIS_PASSWORD", "StrongRedisPassword123")

	// Dodaj retry logiku
	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		rdb = redis.NewClient(&redis.Options{
			Addr:         redisAddr,
			Password:     redisPassword,
			DB:           0,
			DialTimeout:  5 * time.Second,
			ReadTimeout:  3 * time.Second,
			WriteTimeout: 3 * time.Second,
		})

		// Provjera konekcije s Redisom
		if _, err := rdb.Ping(ctx).Result(); err != nil {
			log.Printf("Pokušaj %d/%d spajanja na Redis nije uspio: %v", i+1, maxRetries, err)
			if i == maxRetries-1 {
				log.Fatalf("Ne mogu se spojiti na Redis nakon %d pokušaja: %v", maxRetries, err)
			}
			time.Sleep(2 * time.Second) // Čekaj prije ponovnog pokušaja
			continue
		}

		log.Println("Redis konekcija uspješno uspostavljena")
		break
	}
}

// GetRedisClient - Vraća Redis klijent
func GetRedisClient() *redis.Client {
	if rdb == nil {
		log.Println("Redis klijent nije inicijaliziran, pokušavam inicijalizaciju...")
		InitRedis()
	}
	return rdb
}
