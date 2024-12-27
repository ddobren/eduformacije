# Build stage
FROM golang:1.23 as builder

# Postavi radni direktorij za build
WORKDIR /app

# Kopiraj datoteke modula i instaliraj zavisnosti
COPY go.mod go.sum ./
RUN go mod download

# Kopiraj cijeli projekt
COPY . .

# Buildaj aplikaciju s uključenim optimizacijama
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o main .

# Production stage
FROM alpine:3.18

# Dodaj CA certifikate (za HTTPS komunikaciju, npr. s bazom)
RUN apk --no-cache add ca-certificates

# Postavi radni direktorij za aplikaciju
WORKDIR /root/

# Kopiraj prevedeni binarni fajl
COPY --from=builder /app/main .

# Expose port 80
EXPOSE 80

# Koristi neprivilegiranog korisnika radi sigurnosti
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Ulazna točka
ENTRYPOINT ["./main"]
