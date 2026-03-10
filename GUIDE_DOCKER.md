# Guide Docker et déploiement – Gestion Scolaire

Ce guide explique comment **containeriser** le projet avec Docker, puis comment **déployer** les conteneurs.

---

## 1. Contenu de la containerisation

Le projet est découpé en **3 conteneurs** :

| Service   | Rôle                    | Image / Build      | Port exposé |
|----------|-------------------------|--------------------|-------------|
| **mysql**   | Base de données MySQL   | `mysql:8.0`        | 3306        |
| **backend** | API Node.js (Express)   | Build `backend/`   | 5000        |
| **frontend**| App Vue.js (servie par nginx) | Build `frontend/` | 80 → 8080   |

- **Backend** : un `Dockerfile` dans `backend/` installe les dépendances et lance `node src/app.js`.
- **Frontend** : un `Dockerfile` multi-étapes dans `frontend/` fait `npm run build` puis sert le dossier `dist/` avec **nginx** (SPA : toutes les routes → `index.html`).
- **MySQL** : image officielle, le script `database/schema.sql` est exécuté au premier démarrage (création de la base et des tables).

---

## 2. Lancer en local avec Docker

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) installé
- [Docker Compose](https://docs.docker.com/compose/install/) (souvent inclus avec Docker Desktop)

### Fichier d’environnement

À la racine du projet, crée un fichier `.env` (tu peux t’inspirer de `.env.example`) :

```bash
cp .env.example .env
```

Ajuste si besoin :

- `DB_PASSWORD` : mot de passe root MySQL (par défaut `rootpassword`).
- `JWT_SECRET` : secret pour les tokens (à changer en production).
- `CORS_ORIGIN` : en local avec Docker, `http://localhost:8080` convient.
- `VITE_API_URL` : en local, `http://localhost:5000/api` (URL de l’API vue par le navigateur).

### Build et démarrage

À la **racine du projet** (là où se trouve `docker-compose.yml`) :

```bash
docker compose up --build
```

Ou en arrière-plan :

```bash
docker compose up -d --build
```

- **Frontend** : http://localhost:8080  
- **API** : http://localhost:5000  
- **MySQL** : port 3306 (pour outils type MySQL Workbench, avec user `root` et le mot de passe défini dans `.env`)

Au premier lancement, MySQL peut prendre 30–60 secondes pour être « healthy » ; le backend ne démarre qu’après.

### Arrêter

```bash
docker compose down
```

Pour supprimer aussi les **données MySQL** (volume) :

```bash
docker compose down -v
```

---

## 3. Ordre logique : containerisation puis déploiement

1. **Containerisation** (ce que tu as maintenant)  
   - Dockerfiles + `docker-compose.yml` pour faire tourner l’app en local dans des conteneurs.

2. **Déploiement**  
   - Tu prends ces mêmes conteneurs et tu les fais tourner sur un serveur ou une plateforme.

Donc : **d’abord** tu valides que tout fonctionne avec `docker compose up` en local, **ensuite** tu choisis où déployer (voir section 4).

---

## 4. Options de déploiement avec Docker

### A. Serveur (VPS) ou machine dédiée

- **Hébergeur** : OVH, Scaleway, Hetzner, Contabo, Oracle Cloud (offre gratuite), etc.
- **Sur le serveur** : installer Docker + Docker Compose, cloner le repo, copier un `.env` de production, puis lancer :

  ```bash
  docker compose up -d --build
  ```

- **En production** :
  - Mettre un **reverse proxy** (Nginx ou Caddy) devant le frontend (port 80/443) et éventuellement l’API.
  - Utiliser un **domaine** et un **certificat SSL** (Let’s Encrypt).
  - Dans `.env` : `VITE_API_URL=https://api.ton-domaine.com/api` (ou l’URL réelle de l’API), `CORS_ORIGIN=https://ton-domaine.com`, `JWT_SECRET` fort et unique.

### B. Plateformes qui acceptent Docker

- **Railway** : connecte le repo GitHub, détecte les Dockerfiles ou un `docker-compose`, déploie les services (souvent 1 service = 1 conteneur ; la base peut être MySQL Railway ou externe).
- **Render** : idem, on peut définir des services à partir d’un Dockerfile.
- **Fly.io** : déploiement de conteneurs par région, adapté si tu veux garder ta stack « tout en Docker ».

Pour ces plateformes, tu configures en général **un service par conteneur** (frontend, backend, et une base MySQL managée ou un conteneur MySQL selon l’offre). Les variables d’environnement se renseignent dans l’interface (équivalent de ton `.env`).

### C. Kubernetes (K8s)

- Pour des environnements plus gros ou de la haute dispo.
- Tu déploies les mêmes images Docker, mais tu décris les services, ingress, secrets, etc. en YAML (ou Helm). Souvent overkill pour un premier déploiement.

---

## 5. Résumé du flux recommandé

1. **En local** : `docker compose up --build` → tout tourne (front 8080, API 5000, MySQL 3306).
2. **Variables** : `.env` à la racine (voir `.env.example`), et en production des valeurs adaptées (domaine, `JWT_SECRET`, `VITE_API_URL`, `CORS_ORIGIN`).
3. **Déploiement** : soit VPS + Docker Compose + reverse proxy + SSL, soit plateforme (Railway, Render, Fly.io) en utilisant les mêmes Dockerfiles / images.

Si tu me dis sur quoi tu veux déployer (VPS, Railway, autre), on peut détailler les étapes exactes (fichiers à modifier, commandes, et exemples de config Nginx/Caddy).
