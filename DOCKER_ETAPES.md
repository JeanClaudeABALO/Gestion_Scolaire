# Docker : ce qui a été fait et ce qu’il vous reste à faire

---

## Partie 1 : Ce qui a déjà été fait (dans le projet)

### 1. Backend (API Node.js)

- **Fichier créé : `backend/Dockerfile`**
  - Utilise l’image Node.js 20 (Alpine).
  - Copie `package.json` et `package-lock.json`, puis exécute `npm ci --only=production`.
  - Copie le code source et lance `node src/app.js` sur le port 5000.

- **Fichier créé : `backend/.dockerignore`**
  - Exclut `node_modules`, `.env`, logs, etc., pour que l’image reste légère.

- **Fichier modifié : `backend/src/app.js`**
  - CORS utilise maintenant la variable d’environnement `CORS_ORIGIN` (ex. `http://localhost:8080` en local Docker), pour que le frontend puisse appeler l’API.

---

### 2. Frontend (Vue.js)

- **Fichier créé : `frontend/Dockerfile`**
  - **Étape 1 (build)** : Node 20, `npm ci`, puis `npm run build` avec la variable `VITE_API_URL` (URL de l’API vue par le navigateur).
  - **Étape 2 (serveur)** : image nginx qui sert le dossier `dist/` produit par le build.

- **Fichier créé : `frontend/nginx.conf`**
  - Configuration nginx pour une SPA : toutes les routes renvoient `index.html`, cache des assets (JS, CSS, images).

- **Fichier créé : `frontend/.dockerignore`**
  - Exclut `node_modules`, `dist`, `.env`, etc.

- **Fichier modifié : `frontend/src/services/api.js`**
  - L’URL de l’API n’est plus en dur : elle utilise `import.meta.env.VITE_API_URL` (avec repli sur `http://localhost:5000/api` en dev). En Docker, cette valeur est fixée au moment du build.

---

### 3. Base de données et orchestration

- **Fichier créé : `docker-compose.yml`** (à la racine du projet)
  - **Service `mysql`** : image MySQL 8, mot de passe et base définis via variables. Au premier démarrage, le script `database/schema.sql` est exécuté automatiquement (création des tables). Un volume conserve les données. Un healthcheck attend que MySQL soit prêt.
  - **Service `backend`** : build depuis `backend/`, variables d’environnement (DB_HOST=mysql, DB_PASSWORD, JWT_SECRET, CORS_ORIGIN). Démarre après que MySQL soit « healthy ».
  - **Service `frontend`** : build depuis `frontend/` avec l’argument `VITE_API_URL`. Expose le port 80 du conteneur sur le port **8080** de ta machine.
  - Tous les services sont sur le même réseau Docker pour communiquer (backend → mysql par le nom `mysql`).

---

### 4. Configuration et documentation

- **Fichier créé : `.env.example`** (à la racine)
  - Modèle des variables utilisées par `docker-compose` et le backend : `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGIN`, `VITE_API_URL`. Tu peux le copier en `.env` et adapter les valeurs.

- **Fichier créé : `GUIDE_DOCKER.md`**
  - Décrit la containerisation, comment lancer en local avec Docker, puis les options de déploiement (VPS, Railway, Render, etc.).

---

## Partie 2 : Ce qu’il vous reste à faire maintenant

### Étape 1 : Vérifier que Docker est installé

- Installer [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/) (souvent inclus avec Docker Desktop).
- En ligne de commande : `docker --version` et `docker compose version` doivent fonctionner.

---

### Étape 2 : Fichier `.env` à la racine

- À la **racine du projet** (même niveau que `docker-compose.yml`), créer un fichier **`.env`**.
- Soit copier le modèle :  
  `cp .env.example .env`  
  (si `.env.example` existe).
- Soit créer `.env` avec au minimum :

  ```
  DB_PASSWORD=rootpassword
  JWT_SECRET=changez-moi-en-production-une-longue-chaine-aleatoire
  CORS_ORIGIN=http://localhost:8080
  VITE_API_URL=http://localhost:5000/api
  ```

- Pour un premier test en local, ces valeurs conviennent. En production, il faudra les adapter (voir `GUIDE_DOCKER.md`).

---

### Étape 3 : Lancer le build et les conteneurs

- Ouvrir un terminal à la **racine du projet** (répertoire qui contient `docker-compose.yml`).
- Lancer le build et le démarrage :

  ```bash
  docker compose up --build
  ```

- Dans `docker-compose.yml`, le **build utilise le réseau de l’hôte** (`network: host`) pour limiter les erreurs **ECONNRESET** pendant `npm ci`.
- La première fois, le téléchargement des images et des paquets npm peut prendre plusieurs minutes.
- MySQL démarre en premier ; une fois « healthy », le backend puis le frontend démarrent.

**Si le build échoue encore (ECONNRESET ou erreur « Invalid arguments »)** → voir la section **Dépannage** à la fin de ce fichier.

---

### Étape 4 : Tester l’application

- **Frontend (interface)** : ouvrir dans le navigateur **http://localhost:8080**
- **API** : **http://localhost:5000** (ex. http://localhost:5000/api/test pour un test simple)
- La base est créée et les tables sont en place grâce à `schema.sql`. Si vous avez des données de test (ex. `database/data_example.sql`), vous pouvez les importer manuellement dans le conteneur MySQL si besoin (voir ci‑dessous).

---

### Étape 5 (optionnel) : Données de test

- Le schéma (tables) est appliqué automatiquement au premier démarrage.
- Si vous voulez des **données de démo** (comme dans `DONNEES_TEST.md`), vous pouvez exécuter `database/data_example.sql` dans MySQL :
  - Soit en vous connectant au conteneur :  
    `docker compose exec mysql mysql -u root -p gestion_scolaire < database/data_example.sql`  
    (en utilisant le mot de passe défini dans `.env` pour `DB_PASSWORD`).
  - Soit avec un outil (MySQL Workbench, DBeaver) en vous connectant à `localhost:3306`, utilisateur `root`, mot de passe = valeur de `DB_PASSWORD`.

---

### Étape 6 : Arrêter les conteneurs

- Dans le terminal où tourne `docker compose up` : **Ctrl+C**.
- Ou, si vous avez lancé en arrière-plan avec `docker compose up -d` :

  ```bash
  docker compose down
  ```

- Pour tout arrêter et **supprimer les données MySQL** (repartir de zéro) :

  ```bash
  docker compose down -v
  ```

---

### Après ça : le déploiement

- Une fois que tout fonctionne en local avec `docker compose up`, la prochaine étape est de **déployer** ces mêmes conteneurs sur un serveur ou une plateforme (VPS, Railway, Render, etc.).
- Les détails sont dans **`GUIDE_DOCKER.md`** (section 4 : options de déploiement).

---

## Dépannage (si le build échoue)

### Erreur « ECONNRESET » pendant le build

- Le `docker-compose.yml` utilise **`network: host`** pendant le build pour que `npm ci` utilise le réseau de ta machine. Si l’erreur continue :
  1. Vérifier ta connexion (Wi‑Fi, câble, redémarrer la box).
  2. Réessayer à un autre moment (parfois le registry npm est lent).
  3. **Build manuel avec le réseau de l’hôte** (sans passer par compose pour le build) :
     ```bash
     docker build --network=host -t gestion_scolaire-backend ./backend
     docker build --network=host --build-arg VITE_API_URL=http://localhost:5000/api -t gestion_scolaire-frontend ./frontend
     ```
     Puis lancer uniquement les conteneurs (sans rebuilder) :
     ```bash
     docker compose up
     ```
  4. **Alternative sans npm dans Docker** : préparer tout sur ta machine puis utiliser des images qui ne font que copier les fichiers. À la racine :
     ```bash
     ./build-for-docker.sh
     ```
     Ensuite il faut des Dockerfiles « copy-only » (voir historique du projet ou demander les versions qui copient `dist/` et `node_modules` depuis l’hôte).

### Erreur « Invalid arguments » ou « network » inconnu

- Ta version de Docker Compose ne gère peut‑être pas `network: host` dans la section `build`. Enlève les lignes `network: host` sous `backend` et `frontend` dans `docker-compose.yml`, puis fais le build manuel avec `docker build --network=host` comme ci‑dessus pour backend et frontend.

### MySQL ne démarre pas / backend ne se connecte pas

- Vérifier que le fichier **`.env`** à la racine contient bien **`DB_PASSWORD=...`** (même valeur que pour MySQL).
- Attendre 1 à 2 minutes au premier lancement (MySQL initialise la base).

---

## Récapitulatif en une liste

| Fait dans le projet | À faire de votre côté |
|---------------------|------------------------|
| Backend Dockerfile + .dockerignore | Installer Docker + Docker Compose |
| Frontend Dockerfile + nginx.conf + .dockerignore | Créer `.env` à la racine (voir contenu ci‑dessus) |
| api.js utilise VITE_API_URL | Lancer : `docker compose up --build` |
| app.js utilise CORS_ORIGIN | Tester : http://localhost:8080 et http://localhost:5000 |
| docker-compose.yml (mysql, backend, frontend) | (Optionnel) Importer les données de test |
| .env.example + GUIDE_DOCKER.md | Plus tard : déployer (voir GUIDE_DOCKER.md) |
