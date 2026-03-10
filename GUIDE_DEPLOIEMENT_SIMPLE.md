# Déploiement simple (sans Docker) – hébergeurs gratuits

Ce guide décrit comment déployer **Gestion Scolaire** sur des hébergeurs gratuits : **un serveur Node** (backend + frontend) et **une base de données**.

---

## Choix de la base de données

Ton projet utilise actuellement **MySQL**. Tu as deux possibilités :

| Option | Base | Effort | Hébergeurs gratuits |
|--------|------|--------|---------------------|
| **A – Garder MySQL** | MySQL | Aucun changement de code | PlanetScale (free tier), ou MySQL inclus sur Railway / Render |
| **B – Passer à MongoDB** | MongoDB Atlas | Réécriture du backend (modèles, requêtes) | MongoDB Atlas (free tier) |

**Recommandation** : commencer par l’**option A** (MySQL gratuit) pour déployer tout de suite. Si tu veux vraiment MongoDB plus tard, on pourra adapter le backend (modèles, connexion, requêtes).

---

## Option A : Un serveur Node + MySQL gratuit

### 1. Où héberger le serveur (backend + frontend)

Un seul service Node qui :
- expose l’API (routes `/api/...`) ;
- sert les fichiers du frontend (dossier `dist/` après `npm run build`).

**Hébergeurs gratuits possibles :**

- **Render** (recommandé) : https://render.com  
  - Compte gratuit, déploiement depuis GitHub.  
  - Service « Web Service » pour le Node.  
  - Base MySQL : soit **Render PostgreSQL** (gratuit) → il faudrait alors migrer de MySQL vers PostgreSQL, soit une **base MySQL externe** (voir ci‑dessous).

- **Railway** : https://railway.app  
  - Offre gratuite limitée.  
  - Déploiement depuis GitHub.  
  - Peut ajouter un service MySQL sur le même projet.

- **Cyclic** : https://cyclic.sh  
  - Gratuit pour des apps Node.  
  - Pas de base incluse : tu connectes une base externe (MySQL ou MongoDB).

Pour **MySQL gratuit** en externe (si l’hébergeur n’en propose pas) :

- **PlanetScale** : https://planetscale.com (MySQL compatible, free tier).  
- Ou **Railway** : créer un service MySQL sur ton projet et récupérer l’URL de connexion.

### 2. Préparer le projet pour « un seul serveur »

C’est déjà en place dans le projet :

- Le **backend** sert le dossier **`backend/public`** (fichiers statiques + `index.html` pour la SPA).
- Un script **`build-for-deploy.sh`** à la racine : il build le frontend puis copie `frontend/dist/*` dans **`backend/public`**.

**En local (test)** :
```bash
# À la racine, avec l’URL de l’API (ex. en prod ce sera l’URL Render)
export VITE_API_URL=http://localhost:5000/api
./build-for-deploy.sh

# Puis lancer le serveur
cd backend && npm start
```
Ouvre http://localhost:5000 : l’API est sous `/api`, le reste est le frontend.

**Pour déployer sur Render / Railway** :
- **Build** : installer les deps backend, puis builder le frontend et remplir `backend/public` (voir ci‑dessous).
- **Start** : `node src/app.js` ou `npm start` depuis le dossier **backend** (la racine du service = backend).
- **Variables d’environnement** : `PORT` (fourni par l’hébergeur), `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `CORS_ORIGIN` = l’URL de ton app (ex. `https://gestion-scolaire.onrender.com`).

**Exemple de commandes sur l’hébergeur** (racine du repo = projet) :
- **Build** :  
  `cd frontend && npm ci && VITE_API_URL=https://TON-URL.onrender.com/api npm run build && cd .. && rm -rf backend/public && mkdir -p backend/public && cp -r frontend/dist/* backend/public/`  
  puis `cd backend && npm ci --omit=dev`
- **Start** : `cd backend && node src/app.js`  
  (ou définir la root du service sur le dossier `backend` et lancer `node src/app.js`.)

---

## Option B : MongoDB à la place de MySQL

Si tu veux vraiment **MongoDB** :

- **Base** : créer un cluster gratuit sur **MongoDB Atlas** (https://www.mongodb.com/atlas), récupérer l’URL de connexion (ex. `mongodb+srv://...`).
- **Backend** : il faudra remplacer **mysql2** par **Mongoose** (ou le driver `mongodb`), et réécrire tous les modèles (Professeur, Eleve, Classe, Matiere, Note, etc.) et les contrôleurs pour utiliser MongoDB au lieu des requêtes SQL. C’est un chantier plus long mais faisable.

Une fois le backend migré vers MongoDB, le déploiement du serveur reste le même : un seul service Node (API + frontend en statique) sur Render / Railway / Cyclic, avec la variable d’environnement pour l’URL MongoDB Atlas.

---

## Résumé

- **Sans Docker** : tu déploies un **seul service Node** (backend + frontend servis ensemble) sur un hébergeur gratuit (Render, Railway ou Cyclic).
- **Base** : soit **MySQL gratuit** (PlanetScale ou MySQL sur Railway) sans changer ton code (option A), soit **MongoDB Atlas** après avoir adapté tout le backend (option B).

Si tu me dis si tu pars sur **MySQL gratuit** ou **MongoDB**, je peux te détailler les étapes suivantes (modifs précises du backend pour servir le frontend, et config Render/Railway/PlanetScale ou Atlas).
