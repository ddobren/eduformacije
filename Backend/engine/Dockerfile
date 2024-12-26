# Koristi official Golang base image
FROM golang:1.23 as builder

# Postavi radni direktorij unutar containera
WORKDIR /app

# Inicijalizuj Go modul
RUN go mod init github.com/ddobren/eduformacije

# Kopiraj izvorni kod u radni direktorij
COPY . .

# Preuzmi zavisnosti. Koristi go mod cache da se izbjegnu ponovna preuzimanja.
RUN go mod tidy

# Prevedi Go aplikaciju
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Druga faza za stvaranje tanke slike
FROM alpine:latest
WORKDIR /root/

# Kopiraj prevedenu aplikaciju iz građene faze
COPY --from=builder /app/main .

# Izloži port aplikacije
EXPOSE 80 

# Postavi izvršni fajl kao ulaznu točku
ENTRYPOINT ["./main"]
