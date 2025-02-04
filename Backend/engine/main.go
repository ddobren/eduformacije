package main

import (
	"fmt"
	"log"
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
	logger.SetOutput(&lumberjack.Logger{
		Filename:   "./server.log",
		MaxSize:    1024,
		MaxBackups: 3,
		MaxAge:     28,
		Compress:   true,
	})
	logger.SetFormatter(&logrus.JSONFormatter{})
}

func logRequestDetails(c *gin.Context) {
	start := time.Now()
	clientIP := c.ClientIP()
	c.Next()
	duration := time.Since(start)
	statusCode := c.Writer.Status()

	logger.WithFields(logrus.Fields{
		"client_ip":   clientIP,
		"method":      c.Request.Method,
		"url":         c.Request.URL.Path,
		"status_code": statusCode,
		"duration":    duration,
		"user_agent":  c.Request.UserAgent(),
	}).Info("Request processed")
}

func logError(err error) {
	logger.WithFields(logrus.Fields{
		"error": err.Error(),
	}).Error("An error occurred")
}

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
	config.InitConfig()

	database.InitRedis()
	rdb := database.GetRedisClient()

	// Dodaj channel za sinkronizaciju
	redisDone := make(chan bool)

	// Pokreni UpdateSkoleData u goroutine
	go func() {
		if err := services.UpdateSkoleData(); err != nil {
			log.Printf("❌ Greška pri ažuriranju škola u Redis: %v", err)
		}
		redisDone <- true
	}()

	// Čekaj da se Redis operacija završi
	select {
	case <-redisDone:
		log.Println("✅ Redis ažuriranje završeno")
	case <-time.After(30 * time.Second):
		log.Println("⚠️ Timeout pri ažuriranju Redis podataka")
	}

	database.InitMongo()
	services.UpdateSrednjeSkole()
	services.UpdateOsnovneSkole()

	ginMode := config.GetEnv("GIN_MODE", "debug")
	gin.SetMode(ginMode)

	r := gin.Default()
	r.Use(logRequestDetails)

	trustedProxies := config.GetEnv("GIN_TRUSTED_PROXIES", "127.0.0.1")
	proxies := strings.Split(trustedProxies, ",")
	r.SetTrustedProxies(proxies)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(handlers.CustomRateLimiter(rdb, 10, time.Second))
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	api := r.Group("/api/v1", handlers.JWTAuthMiddleware())
	{
		api.POST("/srednje-skole/sugestije", handlers.PostSugestijeHandler)
		api.GET("/srednje-skole", handlers.GetSrednjeSkoleHandler)
		api.GET("/srednje-skole/zupanije", handlers.GetZupanijeHandler)
		api.GET("/srednje-skole/mjesta", handlers.GetMjestaHandler)
		api.GET("/srednje-skole/vrste-osnivaca", handlers.GetVrsteOsnivacaHandler)

		api.GET("/skole/srednje", handlers.GetSrednjeHandler)
		api.GET("/skole/osnovne", handlers.GetOsnovneHandler)

		api.GET("/status", handlers.GetStatusHandler)
	}

	r.GET("/favicon.ico", func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNoContent)
	})

	go startPolling(24 * time.Hour)

	port := config.GetEnv("PORT", "8080")
	fmt.Printf("Server se pokreće na: %s\n", port)

	if err := r.Run(":" + port); err != nil {
		logError(err)
	}
}
