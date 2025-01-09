package services

import (
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/golang-jwt/jwt/v5"
)

// GenerateJWT - generira novi JWT token za autentifikaciju
// Ova simple autentifikacija je urađena samo za preventiranje od abuse-a, nije bila nužna
func GenerateJWT() (string, error) {
	secretKey := config.GetEnv("API_SECRET", "")

	claims := jwt.MapClaims{
		"authorized": true,
		"client":     "eduformacije-frontend",
		"exp":        time.Now().Add(24 * time.Hour).Unix(), // Token vrijedi 24h
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secretKey))
}
