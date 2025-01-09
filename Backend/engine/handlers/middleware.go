package handlers

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/ddobren/eduformacije/config"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// JWTAuthMiddleware - provjerava JWT u Authorization headeru
func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			log.Println("Authorization header missing or invalid")
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Nevažeći ili nedostajući token"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		secretKey := config.GetEnv("API_SECRET", "")

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Provjera algoritma tokena
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("nevažeći algoritam tokena: %v", token.Header["alg"])
			}
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			log.Printf("Invalid token: %v", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Nevažeći token"})
			return
		}

		log.Printf("Token validated successfully for request: %s %s", c.Request.Method, c.Request.URL.Path)
		c.Next()
	}
}
