package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func ServeStaticSkoleHandler(c *gin.Context) {
	filePath := "../data/srednje-programi.json"

	data, err := os.ReadFile(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Neuspjelo učitavanje JSON datoteke"})
		return
	}

	// Parsiraj JSON da provjerimo ispravnost
	var jsonData interface{}
	if err := json.Unmarshal(data, &jsonData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Neispravan JSON format"})
		return
	}

	c.Data(http.StatusOK, "application/json", data)
}
