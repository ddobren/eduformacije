package main

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/ddobren/eduformacije/database"
	"github.com/ddobren/eduformacije/handlers"
	"github.com/ddobren/eduformacije/services"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

var logger = logrus.New()

// Logiranje vremena trajanja zahtjeva s detaljima
func logRequestDetails(c *gin.Context) {
	start := time.Now()

	// Ispisujemo IP adresu korisnika
	clientIP := c.ClientIP()

	// Proslijedi zahtjev
	c.Next()

	// Izračunaj vrijeme trajanja
	duration := time.Since(start)
	statusCode := c.Writer.Status()

	// Logiranje u JSON formatu za bolje praćenje
	logger.WithFields(logrus.Fields{
		"client_ip":   clientIP,
		"method":      c.Request.Method,
		"url":         c.Request.URL.Path,
		"status_code": statusCode,
		"duration":    duration,
		"user_agent":  c.Request.UserAgent(),
	}).Info("Request processed")
}

// Logiranje grešaka
func logError(err error) {
	logger.WithFields(logrus.Fields{
		"error": err.Error(),
	}).Error("An error occurred")
}

// Periodično ažuriranje podataka svakih 24 sata
func startPolling(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for {
		<-ticker.C
		if err := services.UpdateSkoleData(); err != nil {
			logError(err)
		}
	}
}

func main() {
	// Učitaj konfiguraciju
	config.InitConfig()

	// Inicijalizacija Redis klijenta
	database.InitRedis()
	rdb := database.GetRedisClient()

	// Inicijalizacija MongoDB
	database.InitMongo()
	services.UpdateSrednjeSkole()
	services.UpdateOsnovneSkole()

	// Postavljanje Gin mode iz environment varijable
	ginMode := config.GetEnv("GIN_MODE", "debug") // Default na "debug" ako nije postavljeno
	gin.SetMode(ginMode)                          // Postavljamo Gin mode za debug ili release

	// Kreiramo Gin router
	r := gin.Default()

	// Dodajemo vlastiti middleware za logiranje vremena trajanja zahtjeva
	r.Use(logRequestDetails)

	// Dohvati trusted proxy IP adrese iz environment varijable
	trustedProxies := config.GetEnv("GIN_TRUSTED_PROXIES", "127.0.0.1")
	proxies := strings.Split(trustedProxies, ",")

	// Postavljanje trusted proxies
	r.SetTrustedProxies(proxies)

	// Omogućavanje CORS-a za sigurnost (samo ako aplikacija komunicira s frontendima ili aplikacijama)
	r.Use(gin.Logger())
	r.Use(gin.Recovery()) // Recovery middleware za panic handling

	// Primjena rate limiting middleware-a (10 zahtjeva u 1 sekundi)
	r.Use(handlers.CustomRateLimiter(rdb, 10, time.Second))

	// JWT middleware za osiguranje API-ja
	api := r.Group("/api/v1", handlers.JWTAuthMiddleware())
	{
		api.POST("/srednje-skole/sugestije", handlers.PostSugestijeHandler)
		api.GET("/srednje-skole", handlers.GetSrednjeSkoleHandler)
		api.GET("/srednje-skole/zupanije", handlers.GetZupanijeHandler)
		api.GET("/srednje-skole/mjesta", handlers.GetMjestaHandler)

		api.GET("/skole/srednje", handlers.GetSrednjeSkoleeHandler)
		api.GET("/skole/osnovne", handlers.GetOsnovneSkoleHandler)
	}

	// Periodično ažuriranje podataka svakih 24 sata
	go startPolling(24 * time.Hour)

	// Inicijalno ažuriranje podataka
	if err := services.UpdateSkoleData(); err != nil {
		logError(err)
	}

	// Dohvati port iz environment varijable, default je 8080
	port := config.GetEnv("PORT", "8080")
	logger.Printf("Pokrećem server na :%s", port)

	// Logiranje u datoteku za produkciju (ako GIN_MODE je release)
	if ginMode == "release" {
		logFile, err := os.OpenFile("server.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)
		if err != nil {
			log.Fatalf("Greška pri otvaranju log datoteke: %v", err)
		}
		logger.SetOutput(logFile)

		// Postavljanje formata logova na tekstualni bez boja (plain text)
		logger.SetFormatter(&logrus.TextFormatter{
			FullTimestamp:   true,
			TimestampFormat: time.RFC3339,
			DisableColors:   true, // Onemogućiti boje
			DisableQuote:    true,
		})
	}

	// Pokreni server
	if err := r.Run(":" + port); err != nil {
		logError(err)
	}
}
