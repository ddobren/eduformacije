# Koristi službeni Golang image za build fazu
FROM golang:1.23 as builder

# Postavi radni direktorij
WORKDIR /app

# Kopiraj i instaliraj zavisnosti
COPY go.mod go.sum ./
RUN go mod download

# Kopiraj cijeli projekt
COPY . .

# Buildaj aplikaciju
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Koristi minimalni Alpine image za produkciju
FROM alpine:latest

# Radni direktorij za aplikaciju
WORKDIR /root/

# Kopiraj prevedeni binarni fajl
COPY --from=builder /app/main .

# Izloži port 80
EXPOSE 80

# Ulazna točka
ENTRYPOINT ["./main"]
