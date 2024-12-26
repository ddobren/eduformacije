// config/configLoader.go

package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// InitConfig - Inicijalizacija environment varijabli
func InitConfig() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Nije moguće učitati .env fajl, koriste se default vrijednosti")
	}
}

// GetEnv - Učitavanje varijable iz environment-a
func GetEnv(key, defaultVal string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultVal
}
