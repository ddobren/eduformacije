# Stage 1: Build
FROM golang:1.20 AS builder

WORKDIR /app

# Copy application files
COPY ./*.go ./

# Initialize and tidy up Go modules
RUN [ ! -f go.mod ] && go mod init app || echo "go.mod already exists"
RUN go mod tidy

# Build the application
RUN go build -o main . && ls -l main

# Stage 2: Runtime
FROM debian:bookworm-slim

WORKDIR /root/

# Copy built binary from builder stage
COPY --from=builder /app/main .

# Copy environment file
COPY .env .env

# Update and install certificates
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && \
    update-ca-certificates && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Make the binary executable
RUN chmod +x main

# Expose the application port
EXPOSE 80

# Set the default command to run the binary
CMD ["./main"]
