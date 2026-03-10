#!/bin/bash
# Build pour déploiement "serveur unique" : frontend buildé puis copié dans backend/public
# À lancer depuis la racine du projet. Utilise VITE_API_URL pour l'URL de l'API en production.

set -e
cd "$(dirname "$0")"

# URL de l'API que le navigateur utilisera (à adapter en production)
export VITE_API_URL="${VITE_API_URL:-http://localhost:5000/api}"

echo "=== Build du frontend (VITE_API_URL=$VITE_API_URL) ==="
cd frontend && npm ci && npm run build && cd ..

echo "=== Copie de frontend/dist vers backend/public ==="
rm -rf backend/public
mkdir -p backend/public
cp -r frontend/dist/* backend/public/

echo "=== Terminé. Pour lancer en local : cd backend && npm start ==="
echo "=== Pour déployer : envoyer le dossier backend (avec public/) sur Render/Railway ==="
