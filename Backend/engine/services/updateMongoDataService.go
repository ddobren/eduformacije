package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/ddobren/eduformacije/database"
	"go.mongodb.org/mongo-driver/bson"
)

// fetchData - Dohvaća i parsira JSON s URL-a
func fetchData(url string) ([]map[string]interface{}, error) {
	log.Println("Šaljem GET zahtjev na URL:", url)

	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("ne mogu dohvatiti podatke s URL-a %s: %w", url, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("HTTP greška: primljen status kod %d za URL %s", resp.StatusCode, url)
	}

	log.Println("Čitam podatke iz odgovora...")
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("greška pri čitanju odgovora: %w", err)
	}

	log.Println("Parsiram JSON podatke...")
	var data []map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &data); err != nil {
		return nil, fmt.Errorf("greška pri parsiranju JSON-a: %w", err)
	}

	log.Printf("Uspješno dohvaćeno %d zapisa", len(data))
	return data, nil
}

// UpdateSrednjeSkole - Dohvaća podatke i sprema u MongoDB
func UpdateSrednjeSkole() error {
	// Dohvati URL iz .env
	url := config.GetEnv("SREDNJE_SKOLE_URL", "")
	if url == "" {
		return fmt.Errorf("URL za srednje škole nije definiran u .env datoteci")
	}
	log.Println("Dohvaćam podatke za srednje škole s URL-a:", url)

	data, err := fetchData(url)
	if err != nil {
		return fmt.Errorf("greška pri dohvaćanju podataka za srednje škole: %w", err)
	}
	log.Printf("Dohvaćeno %d zapisa za srednje škole", len(data))

	collection := database.GetMongoCollection("skole", "srednje")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Println("Brišem postojeće podatke za srednje škole...")
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Printf("Greška pri brisanju starih podataka za srednje škole: %v", err)
	}

	docs := make([]interface{}, len(data))
	for i, d := range data {
		docs[i] = d
	}

	log.Println("Spremam nove podatke za srednje škole...")
	_, err = collection.InsertMany(ctx, docs)
	if err != nil {
		return fmt.Errorf("greška pri spremanju srednjih škola u MongoDB: %w", err)
	}

	log.Printf("Uspješno ažurirani podaci za srednje škole (%d zapisa) [MONGODB]", len(data))
	return nil
}

// UpdateOsnovneSkole - Dohvaća podatke i sprema u MongoDB
func UpdateOsnovneSkole() error {
	// Dohvati URL iz .env
	url := config.GetEnv("OSNOVNE_SKOLE_URL", "")
	if url == "" {
		return fmt.Errorf("URL za osnovne škole nije definiran u .env datoteci")
	}
	log.Println("Dohvaćam podatke za osnovne škole s URL-a:", url)

	data, err := fetchData(url)
	if err != nil {
		return fmt.Errorf("greška pri dohvaćanju podataka za osnovne škole: %w", err)
	}
	log.Printf("Dohvaćeno %d zapisa za osnovne škole", len(data))

	for _, item := range data {
		item["zupanija"] = item["zupnija"]
		delete(item, "zupnija")
	}

	collection := database.GetMongoCollection("skole", "osnovne")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	log.Println("Brišem postojeće podatke za osnovne škole...")
	_, err = collection.DeleteMany(ctx, bson.M{})
	if err != nil {
		log.Printf("Greška pri brisanju starih podataka za osnovne škole: %v", err)
	}

	docs := make([]interface{}, len(data))
	for i, d := range data {
		docs[i] = d
	}

	log.Println("Spremam nove podatke za osnovne škole...")
	_, err = collection.InsertMany(ctx, docs)
	if err != nil {
		return fmt.Errorf("greška pri spremanju osnovnih škola u MongoDB: %w", err)
	}

	log.Printf("Uspješno ažurirani podaci za osnovne škole (%d zapisa) [MONGODB]", len(data))
	return nil
}
