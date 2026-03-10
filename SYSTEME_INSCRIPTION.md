# 🔐 Système d'Inscription et d'Authentification Professionnel

## 📋 Vue d'ensemble

Un système complet d'inscription et d'authentification a été mis en place pour les professeurs, avec une page d'accueil institutionnelle, un processus d'inscription sécurisé et une gestion centralisée des codes d'accès.

## ✨ Fonctionnalités implémentées

### 1. Page d'Accueil Institutionnelle (`/`)

#### Header
- Logo/nom du système
- Boutons "Connexion" et "Inscription" à droite
- Design épuré et professionnel
- Visible sur toutes les pages publiques

#### Sections de présentation

**Section 1 - Présentation générale**
- Description du système
- Objectifs principaux (centralisation, suivi, collaboration)
- Message sur la simplicité et la fiabilité

**Section 2 - Fonctionnalités clés**
- 6 cartes présentant les fonctionnalités principales :
  - Gestion des Classes et Matières
  - Saisie et Suivi des Notes
  - Calcul Automatique des Moyennes
  - Accès Sécurisé pour les Parents
  - Tableau de Bord Administrateur
  - Import d'Élèves

**Section 3 - Profils utilisateurs**
- 3 cartes détaillant les rôles :
  - Professeur (fonctionnalités et accès)
  - Responsable Pédagogique (droits étendus)
  - Parent d'Élève (accès en lecture seule)

### 2. Page d'Inscription (`/inscription`)

#### Formulaire structuré

**Informations personnelles**
- Nom (requis)
- Prénom(s) (requis)

**Informations pédagogiques**
- Sélection multiple des matières enseignées
- Liste déroulante avec toutes les matières disponibles
- Affichage : "Matière - Classe"

**Type de compte**
- Radio buttons pour choisir :
  - Professeur Simple
  - Professeur Administrateur
- Avertissement si un admin existe déjà

#### Validation et sécurité

**Contraintes**
- Un seul administrateur autorisé dans le système
- Vérification automatique avant création
- Message d'erreur clair si tentative de création d'un second admin

**Génération du code**
- Code aléatoire unique de 8 caractères (lettres majuscules + chiffres)
- Vérification d'unicité automatique
- Format : `XXXXXXXX` (ex: `A3B7C9D2`)

#### Affichage du code généré

**Interface dédiée**
- Message de succès
- Code affiché en grand, format monospace
- Bouton de copie dans le presse-papiers
- Avertissement de sécurité :
  - "Ce code est strictement personnel"
  - "Il ne sera plus affiché ultérieurement"
  - "En cas d'oubli, contactez le responsable pédagogique"

### 3. Page de Connexion (`/login`)

- Interface existante améliorée
- Redirection automatique si déjà connecté
- Support des deux types d'utilisateurs :
  - Professeurs/Responsables (code professeur)
  - Parents (code secret élève)

### 4. Gestion des Codes par l'Administrateur

#### Fonctionnalité de réinitialisation

**Dans l'espace Responsable**
- Nouvelle colonne "Actions" dans le tableau des professeurs
- Bouton "🔄 Réinitialiser" pour chaque professeur
- Confirmation avant réinitialisation

**Processus**
1. Clic sur "Réinitialiser"
2. Confirmation par dialogue
3. Génération d'un nouveau code unique
4. Affichage dans une modale sécurisée
5. Possibilité de copier le code
6. Mise à jour automatique de la liste

**Sécurité**
- Seul l'administrateur peut réinitialiser les codes
- Nouveau code affiché une seule fois
- Avertissement de sécurité dans la modale

## 🔧 Modifications techniques

### Backend

#### Nouveaux fichiers
- `backend/src/controllers/inscriptionController.js`
  - `checkAdminExists()` : Vérifie si un admin existe
  - `inscription()` : Gère l'inscription complète

#### Modèles mis à jour
- `backend/src/models/Professeur.js`
  - `create()` : Création d'un professeur
  - `countAdmins()` : Compte les administrateurs
  - `updateCode()` : Met à jour le code d'un professeur
  - `generateUniqueCode()` : Génère un code unique aléatoire

#### Contrôleurs mis à jour
- `backend/src/controllers/responsableController.js`
  - `resetProfesseurCode()` : Réinitialise le code d'un professeur

#### Routes ajoutées
- `GET /api/auth/check-admin` : Vérifier si admin existe
- `POST /api/auth/inscription` : Inscription d'un professeur
- `POST /api/responsable/professeurs/:id/reset-code` : Réinitialiser un code

### Frontend

#### Nouveaux fichiers
- `frontend/src/views/Home.vue` : Page d'accueil complète
- `frontend/src/views/Inscription.vue` : Page d'inscription

#### Fichiers modifiés
- `frontend/src/router/index.js` : Routes mises à jour
  - `/` → Home
  - `/login` → Login
  - `/inscription` → Inscription
- `frontend/src/views/Responsable.vue` : Fonctionnalité de réinitialisation ajoutée

## 🔐 Sécurité et contraintes

### Contrôle d'accès
- Un seul administrateur autorisé
- Validation côté serveur stricte
- Codes générés de manière sécurisée

### Gestion des codes
- Codes uniques et aléatoires
- Pas de récupération automatique par l'utilisateur
- Réinitialisation uniquement par l'administrateur
- Affichage unique avec avertissements

### Validation
- Tous les champs requis validés
- Vérification de l'existence des matières
- Contrôle du rôle (PROF ou ADMIN uniquement)

## 📊 Flux d'utilisation

### Inscription d'un professeur

1. Accès à la page d'accueil
2. Clic sur "Inscription"
3. Remplissage du formulaire :
   - Nom, Prénom
   - Sélection des matières
   - Choix du rôle
4. Validation du formulaire
5. Vérification automatique (admin unique)
6. Génération du code
7. Affichage du code avec avertissements
8. Copie et conservation du code
9. Redirection vers la connexion

### Réinitialisation d'un code (Admin)

1. Accès à l'espace Responsable
2. Navigation vers "Professeurs"
3. Clic sur "Réinitialiser" pour un professeur
4. Confirmation
5. Génération d'un nouveau code
6. Affichage dans modale
7. Communication sécurisée au professeur

## 🎯 Avantages

✅ **Processus clair** : Inscription simple et guidée
✅ **Sécurité renforcée** : Codes uniques, contrôle centralisé
✅ **Interface professionnelle** : Design sobre et institutionnel
✅ **Gestion centralisée** : L'admin contrôle tous les accès
✅ **Expérience utilisateur** : Navigation intuitive, messages clairs

## 📝 Notes importantes

1. **Matières existantes** : Les matières doivent être créées avant l'inscription (par l'admin)
2. **Association automatique** : Lors de l'inscription, les matières sélectionnées sont automatiquement associées au professeur
3. **Code unique** : Chaque code est vérifié pour garantir l'unicité
4. **Pas de récupération** : Les professeurs ne peuvent pas récupérer leur code eux-mêmes
5. **Responsabilité admin** : Seul l'administrateur peut réinitialiser les codes

## 🚀 Utilisation

### Pour tester l'inscription

1. Accéder à `http://localhost:5173/`
2. Cliquer sur "Inscription"
3. Remplir le formulaire
4. Noter le code généré
5. Se connecter avec ce code

### Pour réinitialiser un code (Admin)

1. Se connecter en tant qu'administrateur
2. Aller dans "Professeurs"
3. Cliquer sur "Réinitialiser" pour un professeur
4. Noter le nouveau code
5. Le communiquer au professeur de manière sécurisée
