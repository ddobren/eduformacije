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

// InitMongo inicijalizira MongoDB klijent
func InitMongo() {
	// Učitaj MONGO_URI iz .env datoteke
	mongoURI := config.GetEnv("MONGO_URI", "mongodb://localhost:27017")
	log.Printf("Povezivanje na MongoDB s URI: %s", mongoURI)

	clientOptions := options.Client().ApplyURI(mongoURI)

	// Kreiraj kontekst s timeoutom za povezivanje
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Koristi mongo.Connect umjesto mongo.NewClient i client.Connect
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatalf("Greška pri povezivanju na MongoDB: %v", err)
	}

	// Opcionalno, provjeri vezu s Ping
	if err := client.Ping(ctx, nil); err != nil {
		log.Fatalf("Nije moguće pingati MongoDB: %v", err)
	}

	MongoClient = client
	log.Println("Veza s MongoDB uspješno uspostavljena")
}

// GetMongoCollection dohvaća kolekciju iz baze podataka
func GetMongoCollection(database, collection string) *mongo.Collection {
	return MongoClient.Database(database).Collection(collection)
}
