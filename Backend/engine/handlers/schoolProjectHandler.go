package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"

	"github.com/ddobren/eduformacije/database"
	"github.com/ddobren/eduformacije/models"
	"github.com/ddobren/eduformacije/services"
	"github.com/gin-gonic/gin"
)

// PostSugestijeHandler - POST /api/v1/srednje-skole/sugestije
func PostSugestijeHandler(c *gin.Context) {
	var reqBody models.SugestijeRequest
	if err := c.ShouldBindJSON(&reqBody); err != nil {
		log.Printf("Nevažeći JSON body: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Nevažeći JSON body: " + err.Error(),
		})
		return
	}

	explanation, recommendedPrograms, err := services.GetRecommendations(
		reqBody.Interesi,
		reqBody.Programi,
	)
	if err != nil {
		log.Printf("Greška pri pozivu Gemini API: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška pri pozivu Gemini API: " + err.Error(),
		})
		return
	}

	// Sastavimo odgovor
	resp := models.SugestijeResponse{
		Objasnjenje: explanation,
		Programi:    recommendedPrograms,
	}

	c.JSON(http.StatusOK, resp)
}

// ------------------------------------------------------------
func GetSrednjeSkoleHandler(c *gin.Context) {
	rdb := database.GetRedisClient()
	data, err := rdb.Get(c.Request.Context(), "skole_json").Result()
	if err != nil {
		log.Printf("Greška prilikom čitanja iz Redisa: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška prilikom čitanja podataka iz Redisa",
		})
		return
	}

	var skole []models.Skola
	if err := json.Unmarshal([]byte(data), &skole); err != nil {
		log.Printf("Greška pri parsiranju JSON-a: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška pri parsiranju podataka",
		})
		return
	}

	filterZupanija := c.Query("zupanija")
	filterMjesto := c.Query("mjesto")
	filterFounderType := c.Query("founderType")
	filterImaDodatnuProvjeru := c.Query("imaDodatnuProvjeru")

	var filterProvjeraPtr *bool
	if filterImaDodatnuProvjeru != "" {
		val, errBool := strconv.ParseBool(filterImaDodatnuProvjeru)
		if errBool == nil {
			filterProvjeraPtr = &val
		} else {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "nevažeća vrijednost za imaDodatnuProvjeru",
			})
			return
		}
	}

	var filtered []models.Skola
	for _, s := range skole {
		sZupanija := strings.TrimSpace(s.Zupanija)
		sMjesto := strings.TrimSpace(s.Mjesto)
		sFounderType := strings.TrimSpace(s.VrstaOsnivaca)

		if filterZupanija != "" && !strings.EqualFold(sZupanija, filterZupanija) {
			continue
		}
		if filterMjesto != "" && !strings.EqualFold(sMjesto, filterMjesto) {
			continue
		}
		if filterFounderType != "" && !strings.EqualFold(sFounderType, filterFounderType) {
			continue
		}
		if filterProvjeraPtr != nil {
			if s.ImaDodatnuProvjeru == nil || *s.ImaDodatnuProvjeru != *filterProvjeraPtr {
				continue
			}
		}
		filtered = append(filtered, s)
	}

	c.JSON(http.StatusOK, filtered)
}

// GetZupanijeHandler - GET /v1/srednje-skole/zupanije
func GetZupanijeHandler(c *gin.Context) {
	rdb := database.GetRedisClient()
	data, err := rdb.Get(c.Request.Context(), "skole_json").Result()
	if err != nil {
		log.Printf("Greška prilikom čitanja iz Redisa: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška prilikom čitanja podataka iz Redisa",
		})
		return
	}

	var skole []models.Skola
	if err := json.Unmarshal([]byte(data), &skole); err != nil {
		log.Printf("Greška pri parsiranju JSON-a: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška pri parsiranju podataka",
		})
		return
	}

	distinctSet := make(map[string]bool)
	for _, s := range skole {
		z := strings.TrimSpace(s.Zupanija)
		distinctSet[z] = true
	}

	var result []string
	for z := range distinctSet {
		result = append(result, z)
	}
	sort.Strings(result)

	c.JSON(http.StatusOK, result)
}

// GetMjestaHandler - GET /v1/srednje-skole/mjesta
func GetMjestaHandler(c *gin.Context) {
	rdb := database.GetRedisClient()
	data, err := rdb.Get(c.Request.Context(), "skole_json").Result()
	if err != nil {
		log.Printf("Greška prilikom čitanja iz Redisa: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška prilikom čitanja podataka iz Redisa",
		})
		return
	}

	var skole []models.Skola
	if err := json.Unmarshal([]byte(data), &skole); err != nil {
		log.Printf("Greška pri parsiranju JSON-a: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška pri parsiranju podataka",
		})
		return
	}

	distinctSet := make(map[string]bool)
	for _, s := range skole {
		m := strings.TrimSpace(s.Mjesto)
		distinctSet[m] = true
	}

	var result []string
	for m := range distinctSet {
		result = append(result, m)
	}
	sort.Strings(result)

	c.JSON(http.StatusOK, result)
}

// GetVrsteOsnivacaHandler - GET /v1/srednje-skole/vrste-osnivaca
func GetVrsteOsnivacaHandler(c *gin.Context) {
	rdb := database.GetRedisClient()
	data, err := rdb.Get(c.Request.Context(), "skole_json").Result()
	if err != nil {
		log.Printf("Greška prilikom čitanja iz Redisa: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška prilikom čitanja podataka iz Redisa",
		})
		return
	}

	var skole []models.Skola
	if err := json.Unmarshal([]byte(data), &skole); err != nil {
		log.Printf("Greška pri parsiranju JSON-a: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "greška pri parsiranju podataka",
		})
		return
	}

	distinctSet := make(map[string]bool)
	for _, s := range skole {
		v := strings.TrimSpace(s.VrstaOsnivaca)
		distinctSet[v] = true
	}

	var result []string
	for v := range distinctSet {
		result = append(result, v)
	}
	sort.Strings(result)

	c.JSON(http.StatusOK, result)
}
