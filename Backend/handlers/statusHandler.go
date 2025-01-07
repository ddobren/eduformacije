package handlers

import (
	"bufio"
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

// LogEntry defines the structure of the logs we expect to find in server.log
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
		logrus.Errorf("Cannot open log file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot read log file"})
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	var logs []LogEntry
	for scanner.Scan() {
		var logEntry LogEntry
		if err := json.Unmarshal([]byte(scanner.Text()), &logEntry); err != nil {
			logrus.Errorf("Error parsing log entry: %v", err)
			continue // Skip entries that cannot be parsed
		}
		logs = append([]LogEntry{logEntry}, logs...) // Prepend to reverse the order
	}

	if err := scanner.Err(); err != nil {
		logrus.Errorf("Failed to read log file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read log file"})
		return
	}

	c.JSON(http.StatusOK, logs)
}
