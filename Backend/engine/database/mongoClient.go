package database

import (
	"context"
	"log"
	"time"

	"github.com/ddobren/eduformacije/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

// InitMongo initializes the MongoDB client
func InitMongo() {
	// Load MONGO_URI from the .env file
	mongoURI := config.GetEnv("MONGO_URI", "mongodb://localhost:27017")
	log.Printf("Connecting to MongoDB with URI: %s", mongoURI)

	clientOptions := options.Client().ApplyURI(mongoURI)

	// Create a context with a timeout for the connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Use mongo.Connect instead of mongo.NewClient and client.Connect
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Error connecting to MongoDB: %v", err)
	}

	// Optionally, verify the connection with Ping
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Could not ping MongoDB: %v", err)
	}

	MongoClient = client
	log.Println("MongoDB connection established successfully")
}

// GetMongoCollection retrieves a collection from the database
func GetMongoCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}
