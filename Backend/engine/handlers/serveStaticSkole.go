package handlers

import (
	_ "embed"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"
)

//go:embed srednje-programi.json
var srednjeProgrami []byte

// ServeStaticSkoleHandler vraća JSON podatke iz ugrađene datoteke
func ServeStaticSkoleHandler(c *gin.Context) {
	var jsonData interface{}

	// Parsiranje JSON-a kako bi se osiguralo da je ispravan
	if err := json.Unmarshal(srednjeProgrami, &jsonData); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Neispravan JSON format"})
		return
	}

	// Pošalji JSON kao HTTP odgovor
	c.Data(http.StatusOK, "application/json", srednjeProgrami)
}
