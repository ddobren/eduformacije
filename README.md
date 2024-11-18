# Backend Services

Ovaj direktorij sadrži sve backend servise za aplikaciju **Eduformacije**. Svaki servis je modularan i samostalan.

## Struktura

- **search/**: Servis za pretraživanje škola i informacija.
- **auth/**: Servis za autentifikaciju i autorizaciju.
- **news/**: Servis za upravljanje vijestima i člancima.

## Postavljanje

Svaki servis ima svoj vlastiti `cmd/main.go` fajl za pokretanje. Konfiguracije su specifične po servisu.
