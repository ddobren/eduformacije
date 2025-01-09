package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/ddobren/eduformacije/database"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
)

// GetSrednjeHandler - GET /api/v1/skole/srednje
func GetSrednjeHandler(c *gin.Context) {
	collection := database.GetMongoCollection("skole", "srednje")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greška pri dohvaćanju podataka"})
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greška pri parsiranju podataka"})
		return
	}

	c.JSON(http.StatusOK, results)
}

// GetOsnovneHandler - GET /api/v1/skole/osnovne
func GetOsnovneHandler(c *gin.Context) {
	collection := database.GetMongoCollection("skole", "osnovne")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greška pri dohvaćanju podataka"})
		return
	}
	defer cursor.Close(ctx)

	var results []bson.M
	if err := cursor.All(ctx, &results); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "greška pri parsiranju podataka"})
		return
	}

	c.JSON(http.StatusOK, results)
}
