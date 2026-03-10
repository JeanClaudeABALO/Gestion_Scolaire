#!/bin/bash
# Prépare le projet pour le build Docker (sans appel npm dans les conteneurs).
# À lancer depuis la racine du projet avant : docker compose up --build

set -e
cd "$(dirname "$0")"

echo "=== Backend : installation des dépendances (production) ==="
cd backend && npm ci --omit=dev && cd ..

echo "=== Frontend : installation puis build (VITE_API_URL pour Docker) ==="
cd frontend && npm install && VITE_API_URL="${VITE_API_URL:-http://localhost:5000/api}" npm run build && cd ..

echo "=== Prêt. Vous pouvez lancer : docker compose up --build ==="
