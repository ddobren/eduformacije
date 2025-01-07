# Dockerfile

FROM golang:1.23 as builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

FROM alpine:3.18

RUN apk add --no-cache ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE 80

ENTRYPOINT ["./main"]
