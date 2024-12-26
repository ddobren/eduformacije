// services/geminiApiService.go

package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/ddobren/eduformacije/config"
	"github.com/ddobren/eduformacije/models"
)

// geminiCandidatesResponse - struktura odgovora Gemini API-ja
type geminiCandidatesResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// CallGeminiAPI - šalje prompt ka Google Gemini
func CallGeminiAPI(prompt string) (string, error) {
	geminiAPIKey := config.GetEnv("GEMINI_API_KEY", "")
	geminiEndpoint := config.GetEnv("GEMINI_ENDPOINT", "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=")

	// Kreiraj payload
	payload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{"text": prompt},
				},
			},
		},
	}

	// Marshaling payload u JSON
	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("greška pri pripremi tela zahteva: %w", err)
	}

	// Kreiraj novi HTTP request
	req, err := http.NewRequest("POST", geminiEndpoint+geminiAPIKey, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", fmt.Errorf("greška pri kreiranju requesta: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Koristimo HTTP klijent s timeout-om
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Pošaljemo request
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("greška pri slanju zahteva Gemini API-ju: %w", err)
	}
	defer resp.Body.Close()

	// Čitanje odgovora
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("greška pri čitanju odgovora Gemini API-ja: %w", err)
	}

	// Provjera status koda odgovora
	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("gemini API error, status %d: %s", resp.StatusCode, string(respBody))
	}

	// Parsiraj odgovor u geminiCandidatesResponse strukturu
	var gResp geminiCandidatesResponse
	if err := json.Unmarshal(respBody, &gResp); err != nil {
		return "", fmt.Errorf("greška pri parsiranju odgovora Gemini API-ja: %w", err)
	}

	// Ako nema kandidata ili delova u odgovoru
	if len(gResp.Candidates) == 0 || len(gResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("nema candidates/parts u odgovoru AI-ja")
	}

	// Spajanje svih delova teksta u jedan
	var fullText strings.Builder
	for _, cand := range gResp.Candidates {
		for _, part := range cand.Content.Parts {
			fullText.WriteString(part.Text + "\n")
		}
	}

	return fullText.String(), nil
}

// parseGeminiText - razbija tekst po “Objašnjenje:” i “Preporučeni programi:”
func parseGeminiText(fullText string) (string, []models.Recommendation) {
	lines := strings.Split(fullText, "\n")

	var explanation string
	var programsOut []models.Recommendation

	var explanationSection bool
	var programsSection bool

	for _, line := range lines {
		line = strings.TrimSpace(line)

		switch line {
		case "Objašnjenje:":
			explanationSection = true
			programsSection = false
			continue
		case "Preporučeni programi:":
			explanationSection = false
			programsSection = true
			continue
		}

		if explanationSection && line != "" {
			if explanation != "" {
				explanation += " "
			}
			explanation += line
		}

		if programsSection && line != "" {
			programsOut = append(programsOut, models.Recommendation{Program: line})
		}
	}

	return explanation, programsOut
}

// GetRecommendations - kreira prompt, poziva Gemini, parse-uje i vraća “Objašnjenje + Programi”
func GetRecommendations(interesi string, rawPrograms []string) (string, []models.Recommendation, error) {
	prompt := fmt.Sprintf(`Ovo je popis školskih programa: %s.
Na temelju interesa korisnika: '%s', molimo izvedi sljedeće:
1. Napiši "Objašnjenje:" u zasebnom retku, a zatim u sljedećem retku napiši kratki, prijateljski, topao i malo manje formalan odlomak 
(par rečenica na hrvatskom jeziku, možeš dodati i neki emoji, obraćaj se korisniku sa Ti) 
koji će korisniku objasniti zašto su ovi programi preporučeni, 
odnosno koje su njihove prednosti ili zašto bi mogli biti zanimljivi.
Ako interesi korisnika nisu jasni, potpuno su nepovezani sa školskim programima ili neprimjereni, 
onda umjesto prednosti programa vrati samo jedan običan null.

2. Napiši "Preporučeni programi:" u zasebnom retku, a zatim navedi nazive preporučenih programa
bez dodatnih objašnjenja.
Molimo, nemoj pisati ništa drugo osim ovih uputa i traženih odgovora.
`,
		strings.Join(rawPrograms, ", "),
		interesi,
	)

	fullText, err := CallGeminiAPI(prompt)
	if err != nil {
		return "", nil, err
	}

	explanation, programsOut := parseGeminiText(fullText)

	explanation = strings.TrimSpace(explanation)
	explanation = strings.Join(strings.Fields(explanation), " ")

	return explanation, programsOut, nil
}
