package services

import (
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/golang-jwt/jwt/v5"
)

// GenerateJWT - generira novi JWT token za autentifikaciju
func GenerateJWT() (string, error) {
	secretKey := config.GetEnv("API_SECRET", "my_super_secret_key")

	claims := jwt.MapClaims{
		"authorized": true,
		"client":     "eduformacije-frontend",
		"exp":        time.Now().Add(24 * time.Hour).Unix(), // Token vrijedi 24h
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}