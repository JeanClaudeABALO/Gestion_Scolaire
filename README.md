# Système de Gestion Scolaire

Application web complète pour la gestion des notes des élèves avec trois types d'utilisateurs : Professeurs, Responsable (Admin) et Parents.

## Architecture

- **Backend** : API Node.js avec Express et MySQL
- **Frontend** : Application Vue.js 3
- **Base de données** : MySQL

## Structure du projet

```
Gestion_SColaire/
├── backend/          # API Node.js (Express)
│   └── src/
│       ├── config/   # Configuration base de données
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── app.js
├── frontend/         # Application Vue.js
│   └── src/
│       ├── components/
│       ├── router/
│       ├── store/
│       ├── views/
│       └── App.vue
└── database/         # Schéma SQL
    └── schema.sql
```

## Installation

### Prérequis

- Node.js (v16 ou supérieur)
- MySQL (v8 ou supérieur)
- npm ou yarn

### 1. Configuration de la base de données

```bash
# Connectez-vous à MySQL
mysql -u root -p

# Exécutez le script de création
source database/schema.sql
```

### 2. Configuration du Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env

# Éditer .env avec vos paramètres MySQL
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=gestion_scolaire
# JWT_SECRET=votre_secret_jwt_tres_securise
```

### 3. Configuration du Frontend

```bash
cd frontend

# Installer les dépendances
npm install
```

## Démarrage

### Backend

```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:3000`

## Utilisateurs

### Types d'utilisateurs

1. **Professeur** : Accès via `code_professeur`
   - Voir ses classes et matières
   - Saisir/modifier les notes de ses matières

2. **Responsable (Admin)** : Professeur avec rôle `ADMIN`
   - Tous les droits du professeur
   - Voir tous les professeurs, élèves, classes, matières et notes

3. **Parent** : Accès via `code_secret` de l'élève
   - Voir les informations de l'élève
   - Consulter toutes les notes de l'élève

## API Endpoints

### Authentification
- `POST /api/auth/professeur` - Connexion professeur/responsable
- `POST /api/auth/parent` - Connexion parent

### Professeur
- `GET /api/professeur/classes` - Liste des classes du professeur
- `GET /api/professeur/matieres` - Liste des matières du professeur
- `GET /api/professeur/classes/:id/eleves` - Élèves d'une classe
- `GET /api/professeur/matieres/:id/notes` - Notes d'une matière
- `POST /api/professeur/notes` - Créer une note
- `PUT /api/professeur/notes/:id` - Modifier une note

### Responsable
- `GET /api/responsable/professeurs` - Tous les professeurs
- `GET /api/responsable/eleves` - Tous les élèves
- `GET /api/responsable/classes` - Toutes les classes
- `GET /api/responsable/matieres` - Toutes les matières
- `GET /api/responsable/notes` - Toutes les notes

### Parent
- `GET /api/parent/eleve` - Informations de l'élève
- `GET /api/parent/notes` - Notes de l'élève

## Données d'exemple

Pour tester l'application, vous devrez insérer des données dans la base de données :

```sql
-- Exemple d'insertion
INSERT INTO filieres (nom) VALUES ('Informatique');

INSERT INTO classes (nom, filiere_id) VALUES ('6e A', 1);

INSERT INTO professeurs (nom, prenom, code_professeur, role) 
VALUES ('Dupont', 'Jean', 'PROF001', 'PROF'),
       ('Martin', 'Marie', 'ADMIN001', 'ADMIN');

INSERT INTO eleves (nom, prenom, classe_id, code_secret)
VALUES ('Durand', 'Pierre', 1, 'ELEVE001');

INSERT INTO matieres (nom, classe_id, professeur_id)
VALUES ('Mathématiques', 1, 1);
```

## Technologies utilisées

- **Backend** : Express.js, MySQL2, JWT, bcryptjs
- **Frontend** : Vue.js 3, Vue Router, Pinia, Axios, Vite
- **Base de données** : MySQL

## Licence

ISC
