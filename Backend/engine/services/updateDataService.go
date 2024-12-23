// services/updateDataService.go

package services

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"

	"github.com/ddobren/eduformacije/database"
	"github.com/ddobren/eduformacije/models"
)

// UpdateSkoleData - dohvaća JSON podatke sa API-ja i sprema ih u Redis
func UpdateSkoleData() error {
	resp, err := http.Get("https://srednje.e-upisi.hr/api/USS/GetSkole")
	if err != nil {
		return fmt.Errorf("ne mogu dohvatiti podatke s API-ja: %w", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("greška pri čitanju bodyja: %w", err)
	}

	var skole []models.Skola
	if err := json.Unmarshal(bodyBytes, &skole); err != nil {
		return fmt.Errorf("greška pri parsiranju JSON-a: %w", err)
	}

	rdb := database.GetRedisClient()
	ctx := context.Background()

	if err := rdb.Set(ctx, "skole_json", string(bodyBytes), 0).Err(); err != nil {
		return fmt.Errorf("greška pri spremanju u Redis: %w", err)
	}

	log.Printf("Uspješno ažuriran popis škola u Redis (%d škola)", len(skole))
	return nil
}
