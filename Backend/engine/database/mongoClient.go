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

// InitMongo initializes MongoDB client
func InitMongo() {
	mongoURI := config.GetEnv("MONGO_URI", "mongodb://localhost:27017")
	log.Printf("Connecting to MongoDB with URI: %s", mongoURI)

	clientOptions := options.Client().ApplyURI(mongoURI)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Ne mogu se spojiti na MongoDB: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Ne mogu pingati MongoDB: %v", err)
	}

	MongoClient = client
	log.Println("MongoDB konekcija uspješno uspostavljena")
}

func GetMongoCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}
