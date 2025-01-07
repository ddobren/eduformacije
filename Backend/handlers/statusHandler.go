package handlers

import (
	"bufio"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// LogEntry definira strukturu logova koje očekujemo pronaći u server.log
type LogEntry struct {
	ClientIP   string `json:"client_ip"`
	Duration   int64  `json:"duration"`
	Level      string `json:"level"`
	Method     string `json:"method"`
	Message    string `json:"msg"`
	StatusCode int    `json:"status_code"`
	Time       string `json:"time"`
	URL        string `json:"url"`
	UserAgent  string `json:"user_agent"`
}

// GetStatusHandler - GET /api/v1/status
func GetStatusHandler(c *gin.Context) {
	file, err := os.Open("server.log")
	if err != nil {
		logrus.Errorf("Ne mogu otvoriti log datoteku: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ne mogu pročitati log datoteku"})
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var logs []LogEntry
	for scanner.Scan() {
		var logEntry LogEntry
		if err := json.Unmarshal([]byte(scanner.Text()), &logEntry); err != nil {
			logrus.Errorf("Greška pri parsiranju log unosa: %v", err)
			continue // Preskoči unose koje nije moguće parsirati
		}
		logs = append([]LogEntry{logEntry}, logs...) // Prepend za obrnuti redoslijed
	}

	if err := scanner.Err(); err != nil {
		logrus.Errorf("Neuspješno čitanje log datoteke: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Neuspješno čitanje log datoteke"})
		return
	}

	c.JSON(http.StatusOK, logs)
}
