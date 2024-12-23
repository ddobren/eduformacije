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

// InitMongo - Inicijalizacija MongoDB klijenta
func InitMongo() {
	// Učitaj MONGO_URI iz .env datoteke
	mongoURI := config.GetEnv("MONGO_URI", "mongodb://localhost:27017")
	log.Printf("Spajam se na MongoDB s URI: %s", mongoURI)

	clientOptions := options.Client().ApplyURI(mongoURI)

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatalf("Greška pri kreiranju MongoDB klijenta: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatalf("Ne mogu se spojiti na MongoDB: %v", err)
	}

	MongoClient = client
	log.Println("MongoDB konekcija uspješno uspostavljena")
}

// GetMongoCollection - Dohvati kolekciju iz baze
func GetMongoCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}
