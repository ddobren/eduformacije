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
	"github.com/ddobren/eduformacije/models"
)

// UpdateSkoleData - dohvaća JSON podatke sa API-ja i sprema ih u Redis
func UpdateSkoleData() error {
	srednjeUpisiEndpoint := config.GetEnv("SREDNJE_SKOLE_INFO_URL", "")

	// 🔄 Logiraj početak dohvaćanja podataka
	log.Printf("dohvaćam podatke s CDN-a: %s", srednjeUpisiEndpoint)

	// Pokreni HTTP GET zahtjev
	resp, err := http.Get(srednjeUpisiEndpoint)
	if err != nil {
		return fmt.Errorf("ne mogu dohvatiti podatke s API-ja: %w", err)
	}
	defer resp.Body.Close()

	// 📌 Provjeri je li HTTP status 200 OK
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("CDN nije vratio 200 OK, već %d", resp.StatusCode)
	}

	// Čitanje bodyja
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("greška pri čitanju bodyja: %w", err)
	}

	// 📌 Provjeri je li CDN vratio prazan sadržaj
	if len(bodyBytes) == 0 {
		return fmt.Errorf("cdn je vratio prazan sadržaj, podaci neće biti spremljeni u Redis")
	}

	// 📌 Provjeri je li JSON validan prije spremanja u Redis
	var skole []models.Skola
	if err := json.Unmarshal(bodyBytes, &skole); err != nil {
		log.Printf("Greška pri parsiranju JSON-a: %v", err)
		return fmt.Errorf("greška pri parsiranju JSON-a: %w", err)
	}

	// 🔄 Spremanje u Redis s TTL-om 24h
	rdb := database.GetRedisClient()
	ctx := context.Background()
	ttl := 24 * time.Hour

	if err := rdb.Set(ctx, "skole_json", string(bodyBytes), ttl).Err(); err != nil {
		return fmt.Errorf("greška pri spremanju u Redis: %w", err)
	}

	// ✅ Logiraj uspješno ažuriranje podataka
	log.Printf("Uspješno ažuriran popis škola (%d škola) [REDIS]", len(skole))
	return nil
}
