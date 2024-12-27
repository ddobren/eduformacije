# Dockerfile
FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build aplikacije
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Koristi isti image za development
# Ne koristimo alpine za lakše debugiranje
ENTRYPOINT ["./main"]
