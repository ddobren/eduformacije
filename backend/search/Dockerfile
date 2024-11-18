FROM golang:1.20 AS builder

WORKDIR /app

COPY ./*.go ./

RUN [ ! -f go.mod ] && go mod init app || echo "go.mod already exists"

RUN go mod tidy

RUN go build -o main . && ls -l main

FROM debian:bookworm-slim

WORKDIR /root/

COPY --from=builder /app/main .

COPY .env .env

RUN chmod +x main

EXPOSE 8080

CMD ["./main"]
