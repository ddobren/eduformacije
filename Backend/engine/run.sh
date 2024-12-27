#!/bin/bash

# Pokreni Redis
echo "Provjera Redis kontejnera..."
if [ "$(docker ps -q -f name=eduformacije-redis)" ]; then
    echo "Redis kontejner je već pokrenut."
else
    echo "Pokrećem Redis kontejner..."
    docker start 8dc796f2ea48 || { echo "Greška pri pokretanju Redis kontejnera."; exit 1; }
    sleep 2
fi

# Otvori Redis shell u novom terminalu
echo "Otvori Redis shell u novom terminalu..."
gnome-terminal -- bash -c "docker exec -it eduformacije-redis redis-cli; exec bash" || { echo "Greška pri otvaranju Redis shella."; exit 1; }

#========================================

# Pokreni MongoDB
# docker run -d --name eduformacije-mongo -p 27017:27017   -e MONGO_INITDB_ROOT_USERNAME=root   -e MONGO_INITDB_ROOT_PASSWORD=example   mongo:4.4
echo "Provjera MongoDB kontejnera..."
if [ "$(docker ps -q -f name=eduformacije-mongo)" ]; then
    echo "MongoDB kontejner je već pokrenut."
else
    echo "Pokrećem MongoDB kontejner..."
    docker start d16f64247ccf || { echo "Greška pri pokretanju MongoDB kontejnera."; exit 1; }
    sleep 5
fi

# Otvori MongoDB shell u novom terminalu
echo "Otvori MongoDB shell u novom terminalu..."
gnome-terminal -- bash -c "docker exec -it eduformacije-mongo mongo -u root -p example --authenticationDatabase admin; exec bash" || { echo "Greška pri otvaranju MongoDB shella."; exit 1; }

echo "========================================"
echo "Uspješno ste pokrenuli sve kontejnere."
echo "========================================"
