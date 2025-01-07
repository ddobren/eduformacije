package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/ddobren/eduformacije/config" // ili zamijenite s os.Getenv
	"github.com/ddobren/eduformacije/models"
)

// geminiCandidatesResponse - pomaže nam parsirati Google Gemini odgovor
type geminiCandidatesResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
}

// CallGeminiAPI - šalje prompt Google Gemini i vraća plain tekst
func CallGeminiAPI(prompt string) (string, error) {
	geminiAPIKey := config.GetEnv("GEMINI_API_KEY", "")
	geminiEndpoint := config.GetEnv("GEMINI_ENDPOINT", "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=")

	payload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{"text": prompt},
				},
			},
		},
	}

	bodyBytes, err := json.Marshal(payload)
	if err != nil {
		return "", fmt.Errorf("greška pri pripremi JSON payloada: %w", err)
	}

	req, err := http.NewRequest("POST", geminiEndpoint+geminiAPIKey, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", fmt.Errorf("greška pri kreiranju requesta: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("greška pri slanju zahteva Gemini API-ju: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("greška pri čitanju odgovora Gemini API-ja: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("gemini API error, status %d: %s", resp.StatusCode, string(respBody))
	}

	var gResp geminiCandidatesResponse
	if err := json.Unmarshal(respBody, &gResp); err != nil {
		return "", fmt.Errorf("greška pri parsiranju odgovora Gemini API-ja: %w", err)
	}

	if len(gResp.Candidates) == 0 || len(gResp.Candidates[0].Content.Parts) == 0 {
		return "", fmt.Errorf("nema candidates/parts u odgovoru AI-ja")
	}

	var fullText strings.Builder
	for _, candidate := range gResp.Candidates {
		for _, part := range candidate.Content.Parts {
			fullText.WriteString(part.Text)
		}
	}

	return fullText.String(), nil
}

// extractTextBetweenTripleBackticks - dohvaća SAMO sadržaj
// između prve linije s ``` i sljedeće linije s ```.
func extractTextBetweenTripleBackticks(s string) string {
	lines := strings.Split(s, "\n")
	var result []string

	foundOpening := false
	for _, line := range lines {
		trim := strings.TrimSpace(line)

		// Ako linija počinje s ``` i nismo u "otvorenom" stanju
		if strings.HasPrefix(trim, "```") && !foundOpening {
			foundOpening = true
			continue
		}
		// Ako smo unutar backtick-bloka i naiđemo opet na ```
		if foundOpening && strings.HasPrefix(trim, "```") {
			break
		}
		if foundOpening {
			result = append(result, line)
		}
	}
	if len(result) == 0 {
		return ""
	}
	return strings.Join(result, "\n")
}

// parseOrFallback - pokuša parse-ati cleanJSON, inače fallback na fullText
func parseOrFallback(cleanJSON string, fullText string, aiResp interface{}) error {
	// 1) Ako cleanJSON nije prazan, probamo njega
	if cleanJSON != "" {
		if err := json.Unmarshal([]byte(cleanJSON), aiResp); err == nil {
			// Uspjelo
			return nil
		}
		// inače nastavljamo fallback
	}

	// 2) Pokušamo parse cijeli fullText
	return json.Unmarshal([]byte(fullText), aiResp)
}

// GetRecommendations - glavni ulaz: prima interese, listu (SkolaProgramRokId, program)
func GetRecommendations(interesi string, inputPrograms []models.ProgramWithID) (string, []models.ProgramWithID, error) {
	// 1) JSON ulaznih programa
	programsJSON, err := json.Marshal(inputPrograms)
	if err != nil {
		return "", nil, fmt.Errorf("marshaling error: %w", err)
	}

	// 2) Sastavimo prompt
	prompt := fmt.Sprintf(`
	Ovo je popis školskih programa (s pripadajućim SkolaProgramRokId) u JSON formatu:
	%s
	
	Interesi korisnika su: "%s".
	
	Pravila:
	1. Uvijek vrati valjani JSON (bez trostrukih backtickova):
	{
	  "objasnjenje": "...",
	  "programi": [
		{ "SkolaProgramRokId":"...", "program":"..." },
		...
	  ]
	}
	2. "objasnjenje" uvijek treba sadržavati kratki, prijateljski tekst na hrvatskom (obraćaš se korisniku sa 'ti', možeš dodati emoji). 
	   Nikad ne smije biti prazan ni null.
	3. "programi" treba sadržavati barem jedan programa iz popisa koji su imalo povezani s interesima, a ako se ništa ne podudara, vrati programe koje ti predlažeš, nemoj duplicirati programe. 
	   Ako korisnikovi interesi izgledaju potpuno nasumično i nemaju nikakve veze s obrazovanjem, vrati "programi": [] (prazno). 
	   Ali i tada napiši nešto kratko i pozitivno u "objasnjenje" (npr. "Veselimo se čuti više o tvojim obrazovnim interesima!").
	4. Ne spominji ograničenja popisa programa i bilo što u tom kontekstu. - ovo je kompletan popis dostupnih programa.
	   Radije izaberi one koji su barem malo približni korisničkim interesima ili, ako ništa ne vrijedi, stavi prazan niz.
	5. Ne dodaji nikakve dodatne ključeve ni tekst izvan zadanog JSON-a.
	
	Hvala!`, string(programsJSON), interesi)

	// 3) Zovemo AI
	fullText, err := CallGeminiAPI(prompt)
	if err != nil {
		return "", nil, fmt.Errorf("AI API error: %w", err)
	}

	// 4) Pokušamo izvući samo JSON između ``` ... ```
	extracted := extractTextBetweenTripleBackticks(fullText)

	// 5) Parsiranje
	var aiResponse struct {
		Objasnjenje string                 `json:"objasnjenje"`
		Programi    []models.ProgramWithID `json:"programi"`
	}
	if err := parseOrFallback(extracted, fullText, &aiResponse); err != nil {
		return "", nil, fmt.Errorf(
			"nije došao valjani JSON od AI-ja:\n---\n%s\n---\nparse err: %w",
			fullText, err,
		)
	}

	return aiResponse.Objasnjenje, aiResponse.Programi, nil
}
