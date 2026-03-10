# Guide de Démarrage Rapide

## Étapes pour lancer l'application

### 1. Base de données

```bash
# Se connecter à MySQL
mysql -u root -p

# Créer la base de données et les tables
source database/schema.sql

# (Optionnel) Insérer des données d'exemple
source database/data_example.sql
```

### 2. Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env (copier depuis .env.example)
# Puis éditer avec vos paramètres MySQL :
# - DB_HOST=localhost
# - DB_USER=root
# - DB_PASSWORD=votre_mot_de_passe
# - DB_NAME=gestion_scolaire
# - JWT_SECRET=un_secret_aleatoire_securise

# Démarrer le serveur
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer l'application
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`

## Test de connexion

### En tant que Professeur
- Code : `PROF001` (si vous avez utilisé data_example.sql)
- Accès : Espace professeur avec ses classes et matières

### En tant que Responsable (Admin)
- Code : `ADMIN001` (si vous avez utilisé data_example.sql)
- Accès : Tableau de bord complet avec toutes les données

### En tant que Parent
- Code secret : `ELEVE001` (si vous avez utilisé data_example.sql)
- Accès : Informations et notes de l'élève

## Structure des URLs

- Frontend : http://localhost:3000
- Backend API : http://localhost:5000/api

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les paramètres dans `.env`
- Vérifiez que la base de données `gestion_scolaire` existe

### Erreur CORS
- Vérifiez que le backend est démarré sur le port 5000
- Vérifiez la configuration CORS dans `backend/src/app.js`

### Erreur d'authentification
- Vérifiez que le JWT_SECRET est défini dans `.env`
- Vérifiez que le token est bien envoyé dans les headers
