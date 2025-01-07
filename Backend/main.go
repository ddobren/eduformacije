package main

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/ddobren/eduformacije/database"
	"github.com/ddobren/eduformacije/handlers"
	"github.com/ddobren/eduformacije/services"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gopkg.in/natefinch/lumberjack.v2"
)

var logger = logrus.New()

func init() {
	// Konfiguracija loggera za upotrebu lumberjack
	logger.SetOutput(&lumberjack.Logger{
		Filename:   "./server.log", // putanja do log datoteke
		MaxSize:    1024,           // maksimalna veličina u megabajtima (1GB)
		MaxBackups: 3,              // maksimalan broj backup datoteka
		MaxAge:     28,             // maksimalan broj dana za zadržavanje backup datoteka
		Compress:   true,           // da li da komprimira backup datoteke
	})
	// Postavljanje formata logiranja na JSON
	logger.SetFormatter(&logrus.JSONFormatter{})
}

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
	services.UpdateSkoleData()

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
	r.SetTrustedProxies(proxies)

	// Dodaj CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"https://www.w3schools.com", "https://engine.eduformacije.com"}, // Dozvoljene domene
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},                      // Dozvoljene HTTP metode
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},                      // Dozvoljeni zaglavlja
		ExposeHeaders:    []string{"Content-Length"},                                               // Zaglavlja koja se izlažu
		AllowCredentials: true,                                                                     // Omogućavanje kolačića
		MaxAge:           12 * time.Hour,                                                           // Cache za preflight zahtjeve
	}))

	// Primjena rate limiting middleware-a (10 zahtjeva u 1 sekundi)
	r.Use(handlers.CustomRateLimiter(rdb, 10, time.Second))
	r.Use(gin.Logger())
	r.Use(gin.Recovery()) // Recovery middleware za panic handling

	// JWT middleware za osiguranje API-ja
	api := r.Group("/api/v1", handlers.JWTAuthMiddleware())
	{
		api.POST("/srednje-skole/sugestije", handlers.PostSugestijeHandler)
		api.GET("/srednje-skole", handlers.GetSrednjeSkoleHandler)
		api.GET("/srednje-skole/zupanije", handlers.GetZupanijeHandler)
		api.GET("/srednje-skole/mjesta", handlers.GetMjestaHandler)

		api.GET("/skole/srednje", handlers.GetSrednjeSkoleeHandler)
		api.GET("/skole/osnovne", handlers.GetOsnovneSkoleHandler)

		api.GET("/status", handlers.GetStatusHandler)
	}

	// favicon.ico handler, ignore it
	r.GET("/favicon.ico", func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNoContent)
	})

	// Periodično ažuriranje podataka svakih 24 sata
	go startPolling(24 * time.Hour)

	// Dohvati port iz environment varijable, default je 8080
	port := config.GetEnv("PORT", "8080")
	fmt.Printf("Server se pokreće na: %s\n", port)

	// Pokreni server
	if err := r.Run(":" + port); err != nil {
		logError(err)
	}
}
