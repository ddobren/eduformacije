package services

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/ddobren/eduformacije/database"
)

// UpdateSkoleData - dohvaća JSON podatke sa API-ja i sprema ih u Redis
func UpdateSkoleData() error {
	srednjeUpisiEndpoint := config.GetEnv("SREDNJE_SKOLE_INFO_URL", "")
	log.Printf("🔄 Započinjem UpdateSkoleData")
	log.Printf("📡 URL endpoint: %s", srednjeUpisiEndpoint)

	// HTTP klijent s dužim timeoutom
	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			DisableKeepAlives: true,
			IdleConnTimeout:   30 * time.Second,
		},
	}

	resp, err := client.Get(srednjeUpisiEndpoint)
	if err != nil {
		log.Printf("❌ Greška pri HTTP GET zahtjevu: %v", err)
		return fmt.Errorf("ne mogu dohvatiti podatke s API-ja: %w", err)
	}
	defer resp.Body.Close()

	// Čitanje bodyja s većim bufferom
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("❌ Greška pri čitanju bodyja: %v", err)
		return fmt.Errorf("greška pri čitanju bodyja: %w", err)
	}

	// Koristi context s timeoutom za Redis operacije
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	rdb := database.GetRedisClient()

	// Prvo obriši stare podatke
	err = rdb.Del(ctx, "skole_json").Err()
	if err != nil {
		log.Printf("⚠️ Greška pri brisanju starog ključa: %v", err)
	}

	// Spremi nove podatke
	err = rdb.Set(ctx, "skole_json", string(bodyBytes), 24*time.Hour).Err()
	if err != nil {
		log.Printf("❌ Greška pri spremanju u Redis: %v", err)
		return fmt.Errorf("greška pri spremanju u Redis: %w", err)
	}

	// Provjeri jesu li podaci spremljeni
	val, err := rdb.Get(ctx, "skole_json").Result()
	if err != nil {
		log.Printf("❌ Greška pri provjeri podataka: %v", err)
		return fmt.Errorf("greška pri provjeri podataka: %w", err)
	}

	if len(val) == 0 {
		return fmt.Errorf("podaci su spremljeni ali su prazni")
	}

	log.Printf("✅ Podaci uspješno spremljeni u Redis (veličina: %d bytes)", len(val))
	return nil
}
