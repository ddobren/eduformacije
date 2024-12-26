import requests
import threading

# API endpoint i token
URL = "http://localhost:8080/api/v1/skole/srednje"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.4rz5eH4rojtUQSPI8CcroOf4CRJjo6N9_HQAI_9e1t0"

# Broj zahtjeva i broj niti
NUM_REQUESTS = 100
NUM_THREADS = 10

# Naziv fajla za logiranje odgovora
LOG_FILE = "responses.log"

# Funkcija za slanje zahtjeva
def send_request():
    headers = {"Authorization": f"Bearer {TOKEN}"}
    try:
        response = requests.get(URL, headers=headers)
        log_response(response.status_code, response.text)
    except Exception as e:
        log_response("Error", str(e))

# Funkcija za zapisivanje odgovora u fajl
def log_response(status_code, response_text):
    with open(LOG_FILE, "a") as file:
        file.write(f"Status Code: {status_code}\nResponse: {response_text}\n{'-'*50}\n")

# Glavna funkcija za pokretanje niti
def main():
    threads = []
    # Brisanje prethodnih podataka u fajlu
    with open(LOG_FILE, "w") as file:
        file.write("Test započet:\n\n")

    for _ in range(NUM_THREADS):
        thread = threading.Thread(target=lambda: [send_request() for _ in range(NUM_REQUESTS // NUM_THREADS)])
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    print(f"Test završen. Provjerite log fajl: {LOG_FILE}")

if __name__ == "__main__":
    main()

