# Déployer Gestion Scolaire sur Render

Guide pas à pas pour mettre l’application en ligne sur **Render** (serveur Node) avec une base **MySQL** sur **PlanetScale** (gratuit).

---

## Vue d’ensemble

- **Render** : héberge le serveur Node (API + frontend servis ensemble).
- **PlanetScale** : base MySQL gratuite (Render ne propose pas MySQL, seulement PostgreSQL).
- **Résultat** : une seule URL (ex. `https://gestion-scolaire.onrender.com`) pour l’app.

---

## Étape 1 : Créer la base MySQL (PlanetScale)

1. Va sur **https://planetscale.com** et crée un compte (gratuit).
2. **Create a new database** : nom par ex. `gestion-scolaire`, région au choix.
3. Une fois la base créée, ouvre l’onglet **Connect** (ou **Connection strings**).
4. Choisis **Connect with: General** pour avoir les infos séparées :
   - **Host**
   - **Username**
   - **Password** (clique sur **Create password** si besoin)
   - **Database name**
5. Note ces valeurs : tu en auras besoin pour les variables d’environnement sur Render.
6. (Optionnel) Pour importer ton schéma : dans PlanetScale, onglet **Console** → tu peux exécuter du SQL. Copie le contenu de ton fichier `database/schema.sql` et exécute-le (en adaptant si besoin `CREATE DATABASE` car PlanetScale crée déjà la base).

---

## Étape 2 : Préparer le dépôt GitHub

1. Ton projet doit être poussé sur GitHub (déjà fait si tu as suivi le guide GitHub).
2. Vérifier que le **build** fonctionne en local (optionnel mais recommandé) :
   ```bash
   export VITE_API_URL=https://gestion-scolaire.onrender.com/api
   ./build-for-deploy.sh
   cd backend && npm start
   ```
   Tu peux utiliser une URL temporaire ; on mettra la vraie URL Render à l’étape 4.

---

## Étape 3 : Créer le Web Service sur Render

1. Va sur **https://render.com** et connecte-toi (avec GitHub).
2. **Dashboard** → **New +** → **Web Service**.
3. Connecte ton dépôt **Gestion_Scolaire** (ou le repo qui contient le projet) si ce n’est pas déjà fait.
4. Choisis le **repository** et la **branch** (ex. `main`).
5. Renseigne :

   | Champ | Valeur |
   |-------|--------|
   | **Name** | `gestion-scolaire` (ou un autre nom ; l’URL sera `https://<name>.onrender.com`) |
   | **Region** | Frankfurt ou Oregon (au choix) |
   | **Root Directory** | *laisser vide* |
   | **Runtime** | Node |
   | **Build Command** | Voir ci-dessous |
   | **Start Command** | `cd backend && node src/app.js` |
   | **Instance Type** | Free |

6. **Build Command** (à copier-coller en une seule ligne) :
   ```bash
   cd frontend && npm ci && npm run build && cd .. && rm -rf backend/public && mkdir -p backend/public && cp -r frontend/dist/* backend/public/ && cd backend && npm ci --omit=dev
   ```

7. Ne lance pas encore le déploiement : on ajoute d’abord les variables d’environnement.

---

## Étape 4 : Variables d’environnement sur Render

1. Dans la page de création (ou d’édition) du service, section **Environment**.
2. Ajoute les variables suivantes (bouton **Add Environment Variable**) :

   | Key | Value | Note |
   |-----|--------|------|
   | `VITE_API_URL` | `https://gestion-scolaire.onrender.com/api` | Remplace `gestion-scolaire` par le **Name** de ton service si différent. Utilisé au **build** du frontend. |
   | `DB_HOST` | *(host PlanetScale)* | Ex. `aws.connect.psdb.cloud` |
   | `DB_PORT` | `3306` | |
   | `DB_USER` | *(username PlanetScale)* | |
   | `DB_PASSWORD` | *(password PlanetScale)* | |
   | `DB_NAME` | *(database name PlanetScale)* | Ex. `gestion-scolaire` |
   | `JWT_SECRET` | *(une longue chaîne aléatoire)* | Génère une clé forte (ex. 32 caractères) et ne la partage pas. |
   | `CORS_ORIGIN` | `https://gestion-scolaire.onrender.com` | Même base que `VITE_API_URL` sans `/api`. |
   | `DB_SSL` | `true` | Obligatoire pour PlanetScale (connexion sécurisée). |

3. **PORT** : Render le définit automatiquement ; inutile de l’ajouter.
4. Sauvegarde (ou crée le service). Le premier déploiement se lance.

---

## Étape 5 : Premier déploiement

1. Clique sur **Create Web Service** (ou **Save** si tu édites un service existant).
2. Render va :
   - cloner le repo ;
   - exécuter la **Build Command** (install frontend, build Vue avec `VITE_API_URL`, copie dans `backend/public`, install backend) ;
   - lancer la **Start Command** (`cd backend && node src/app.js`).
3. Les logs s’affichent. En cas d’erreur, vérifie les variables d’environnement (surtout `DB_*` et `VITE_API_URL`).
4. Une fois le build vert, l’app est accessible à :  
   **https://&lt;ton-service-name&gt;.onrender.com**

---

## Étape 6 : Vérifications

- Ouvre l’URL dans le navigateur : tu dois voir le frontend (login, etc.).
- Teste la connexion et une action (ex. login).
- Si l’API ne répond pas : vérifie les logs Render (onglet **Logs**) et que `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` correspondent bien à PlanetScale. Vérifie aussi que le schéma SQL (tables) a été exécuté dans PlanetScale (étape 1).

---

## Modifier l’URL après création

Si tu as créé le service avec un autre nom et que l’URL a changé :

1. **Render** → ton service → **Environment**.
2. Mets à jour **`VITE_API_URL`** et **`CORS_ORIGIN`** avec la vraie URL (ex. `https://gestion-scolaire-abc123.onrender.com`).
3. **Manual Deploy** → **Clear build cache & deploy** pour rebuilder le frontend avec la bonne URL.

---

## Limites du plan gratuit Render

- Le service **s’endort** après ~15 min sans requête ; le premier appel après ça peut prendre 30–60 secondes (réveil).
- Pas de MySQL sur Render : d’où l’usage de **PlanetScale** pour la base.

---

## Récapitulatif des commandes Render

| Réglage | Valeur |
|--------|--------|
| **Build Command** | `cd frontend && npm ci && npm run build && cd .. && rm -rf backend/public && mkdir -p backend/public && cp -r frontend/dist/* backend/public/ && cd backend && npm ci --omit=dev` |
| **Start Command** | `cd backend && node src/app.js` |
| **Variables obligatoires** | `VITE_API_URL`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `CORS_ORIGIN`, `DB_SSL` (= `true` pour PlanetScale) |

Une fois tout ça en place, chaque push sur la branche connectée (ex. `main`) déclenchera un nouveau déploiement sur Render.
