package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// School represents the JSON structure for a school
type School struct {
	ID            uint   `gorm:"primaryKey" json:"ID"`
	Web           string `json:"Web" gorm:"column:web"`
	Faks          string `json:"Faks" gorm:"column:faks"`
	Naziv         string `json:"Naziv" gorm:"column:naziv"`
	Adresa        string `json:"Adresa" gorm:"column:adresa"`
	Mjesto        string `json:"Mjesto" gorm:"column:mjesto"`
	Sifra         string `json:"Šifra" gorm:"column:sifra;unique"`
	Telefon       string `json:"Telefon" gorm:"column:telefon"`
	Eposta        string `json:"ePošta" gorm:"column:eposta"`
	Osnivac       string `json:"Osnivač" gorm:"column:osnivac"`
	Zupanija      string `json:"Županija" gorm:"column:zupanija"`
	Ravnatelj     string `json:"Ravnatelj" gorm:"column:ravnatelj"`
	TipUstanove   string `json:"TipUstanove" gorm:"column:tip_ustanove"`
	PostanskiBroj string `json:"PoštanskiBroj" gorm:"column:postanski_broj"`
}

// Prilagođeno mapiranje JSON ključeva
func (s *School) UnmarshalJSON(data []byte) error {
	temp := make(map[string]interface{})
	if err := json.Unmarshal(data, &temp); err != nil {
		return err
	}

	// Mapiraj polja
	if web, ok := temp["Web"].(string); ok {
		s.Web = web
	}
	if faks, ok := temp["Faks"].(string); ok {
		s.Faks = faks
	}
	if naziv, ok := temp["Naziv"].(string); ok {
		s.Naziv = naziv
	}
	if adresa, ok := temp["Adresa"].(string); ok {
		s.Adresa = adresa
	}
	if mjesto, ok := temp["Mjesto"].(string); ok {
		s.Mjesto = mjesto
	}
	if sifra, ok := temp["Šifra"].(string); ok {
		s.Sifra = sifra
	}
	if telefon, ok := temp["Telefon"].(string); ok {
		s.Telefon = telefon
	}
	if eposta, ok := temp["ePošta"].(string); ok {
		s.Eposta = eposta
	}
	if osnivac, ok := temp["Osnivač"].(string); ok {
		s.Osnivac = osnivac
	}
	// Mapiraj "Župnija" i "Županija" na Zupanija
	if zupanija, ok := temp["Županija"].(string); ok {
		s.Zupanija = zupanija
	} else if zupnija, ok := temp["Župnija"].(string); ok {
		s.Zupanija = zupnija
	}
	if ravnatelj, ok := temp["Ravnatelj"].(string); ok {
		s.Ravnatelj = ravnatelj
	}
	if tipUstanove, ok := temp["TipUstanove"].(string); ok {
		s.TipUstanove = tipUstanove
	}
	if postanskiBroj, ok := temp["PoštanskiBroj"].(string); ok {
		s.PostanskiBroj = postanskiBroj
	}

	return nil
}

var db *gorm.DB

func main() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get database connection string from environment variables
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		log.Fatal("DB_DSN is not set in .env file")
	}

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Set up Gin router
	r := gin.Default()

	// Routes for middle schools
	r.GET("/srednje-skole/load", func(c *gin.Context) {
		loadSchools(c, "srednje_skole", os.Getenv("MIDDLE_SCHOOLS_URL"))
	})
	r.GET("/srednje-skole", func(c *gin.Context) {
		getSchools(c, "srednje_skole")
	})

	// Routes for primary schools
	r.GET("/osnovne-skole/load", func(c *gin.Context) {
		loadSchools(c, "osnovne_skole", os.Getenv("PRIMARY_SCHOOLS_URL"))
	})
	r.GET("/osnovne-skole", func(c *gin.Context) {
		getSchools(c, "osnovne_skole")
	})

	// Start server on configured port
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default to port 8080 if not set
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}

func loadSchools(c *gin.Context, tableName, url string) {
	if url == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Data URL not provided in .env file"})
		return
	}

	// Ensure the table exists
	if err := db.Table(tableName).AutoMigrate(&School{}); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Failed to migrate database: %v", err),
		})
		return
	}

	// Fetch JSON data
	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch data: %v", err)})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to read response body: %v", err)})
		return
	}

	var schools []School
	if err := json.Unmarshal(body, &schools); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to parse JSON: %v", err)})
		return
	}

	remoteSifraSet := make(map[string]bool)
	for _, school := range schools {
		remoteSifraSet[school.Sifra] = true
		var existingSchool School

		// Check if the record exists
		if err := db.Table(tableName).Where("sifra = ?", school.Sifra).First(&existingSchool).Error; err == nil {
			needsUpdate := existingSchool.Web != school.Web ||
				existingSchool.Faks != school.Faks ||
				existingSchool.Naziv != school.Naziv ||
				existingSchool.Adresa != school.Adresa ||
				existingSchool.Mjesto != school.Mjesto ||
				existingSchool.Telefon != school.Telefon ||
				existingSchool.Eposta != school.Eposta ||
				existingSchool.Osnivac != school.Osnivac ||
				existingSchool.Ravnatelj != school.Ravnatelj ||
				existingSchool.Zupanija != school.Zupanija ||
				existingSchool.TipUstanove != school.TipUstanove ||
				existingSchool.PostanskiBroj != school.PostanskiBroj

			if needsUpdate {
				if err := db.Table(tableName).Model(&existingSchool).Updates(school).Error; err != nil {
					log.Printf("Failed to update school (\\u0160ifra: %s): %v", school.Sifra, err)
				} else {
					log.Printf("Updated school (\\u0160ifra: %s)", school.Sifra)
				}
			}
		} else if err == gorm.ErrRecordNotFound {
			// Insert new record
			if err := db.Table(tableName).Create(&school).Error; err != nil {
				log.Printf("Failed to create school (\\u0160ifra: %s): %v", school.Sifra, err)
			} else {
				log.Printf("Inserted new school (\\u0160ifra: %s)", school.Sifra)
			}
		} else {
			log.Printf("Failed to query school (\\u0160ifra: %s): %v", school.Sifra, err)
		}
	}

	// Delete records not in JSON
	var allSchools []School
	if err := db.Table(tableName).Find(&allSchools).Error; err == nil {
		for _, school := range allSchools {
			if _, exists := remoteSifraSet[school.Sifra]; !exists {
				if err := db.Table(tableName).Delete(&school).Error; err != nil {
					log.Printf("Failed to delete school (\\u0160ifra: %s): %v", school.Sifra, err)
				} else {
					log.Printf("Deleted school (\\u0160ifra: %s)", school.Sifra)
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Schools synchronized successfully"})
}

func getSchools(c *gin.Context, tableName string) {
	var schools []School
	if err := db.Table(tableName).Find(&schools).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("Failed to fetch schools: %v", err),
		})
		return
	}

	if len(schools) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"message": "No data available in the database. Please load data first.",
		})
		return
	}

	c.JSON(http.StatusOK, schools)
}
