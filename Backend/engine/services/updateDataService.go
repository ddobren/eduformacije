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

	client := &http.Client{
		Timeout: 30 * time.Second,
		Transport: &http.Transport{
			DisableKeepAlives: true,
			IdleConnTimeout:   30 * time.Second,
		},
	}

	var resp *http.Response
	var err error

	// Pokušat ćemo 3 puta, s kratkom pauzom između
	maxRetries := 3
	for i := 1; i <= maxRetries; i++ {
		resp, err = client.Get(srednjeUpisiEndpoint)
		if err == nil {
			// Ako nema greške na razini konekcije, pogledaj status code
			if resp.StatusCode >= 200 && resp.StatusCode < 300 {
				// Uspješan dohvat
				break
			} else {
				// Npr. 308 redirect ili 5xx
				resp.Body.Close()
				log.Printf("⚠️ Pokušaj %d: HTTP status nije 2xx (bio je %d). Čekam i pokušavam opet...", i, resp.StatusCode)
			}
		} else {
			log.Printf("⚠️ Pokušaj %d dohvaćanja nije uspio: %v", i, err)
		}

		// Pričekaj 5 sekundi prije sljedećeg pokušaja (osim ako je zadnji)
		if i < maxRetries {
			time.Sleep(5 * time.Second)
		}
	}

	// Ako resp ili err nakon pokušaja i dalje nisu dobri, odustajemo
	if err != nil {
		return fmt.Errorf("ne mogu dohvatiti podatke s API-ja nakon %d pokušaja: %w", maxRetries, err)
	}
	// Dodatno provjeri jesmo li uspjeli dobiti neki 2xx status
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return fmt.Errorf("HTTP status code nije uspješan (%d) nakon %d pokušaja", resp.StatusCode, maxRetries)
	}

	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("❌ Greška pri čitanju bodyja: %v", err)
		return fmt.Errorf("greška pri čitanju bodyja: %w", err)
	}

	// Sada radimo s Redisom
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	rdb := database.GetRedisClient()

	// Prvo brisanje starog ključa
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

	// Provjeri jesu li spremljeni
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
