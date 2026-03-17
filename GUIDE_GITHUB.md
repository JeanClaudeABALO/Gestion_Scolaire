# Déposer le projet sur GitHub – Guide pas à pas

## Ce qui est déjà fait

- Dépôt Git initialisé dans le projet
- Fichier `.gitignore` à la racine (pour ne pas envoyer `node_modules/`, `.env`, etc.)
- Fichier `.env.local` du frontend ignoré (pour ne pas exposer de secrets)
- Tous les fichiers ont été ajoutés avec `git add .`
- La branche s’appelle `main`

Il reste à **configurer ton identité Git** (une fois), **créer le dépôt sur GitHub**, puis **faire le premier commit et le push**.

---

## Étape 1 : Configurer ton identité Git (une seule fois)

Ouvre un terminal dans le projet et exécute (remplace par tes vraies infos) :

```bash
git config --global user.email "ton-email@exemple.com"
git config --global user.name "Ton Nom ou Pseudo GitHub"
```

Exemple :

```bash
git config --global user.email "jean.dupont@gmail.com"
git config --global user.name "Jean Dupont"
```

---

## Étape 2 : Créer le premier commit (si pas encore fait)

Dans le dossier du projet :

```bash
cd /home/jean/Bureau/Gestion_SColaire
git commit -m "Initial commit: Gestion Scolaire - backend Node/Express, frontend Vue.js, base MySQL"
```

---

## Étape 3 : Créer un dépôt sur GitHub

1. Va sur **https://github.com** et connecte-toi.
2. Clique sur le **+** en haut à droite → **New repository**.
3. Renseigne :
   - **Repository name** : par exemple `Gestion_SColaire` ou `gestion-scolaire`.
   - **Description** (optionnel) : ex. "Application de gestion scolaire - Vue.js, Node.js, MySQL".
   - **Public** ou **Private** selon ton choix.
   - Ne coche **pas** "Add a README file" (tu en as déjà un).
4. Clique sur **Create repository**.

---

## Étape 4 : Lier ton projet au dépôt GitHub

GitHub affiche des commandes. Utilise celles-ci (en remplaçant `TON_PSEUDO` et `NOM_DU_REPO` par les tiens) :

```bash
cd /home/jean/Bureau/Gestion_SColaire
git remote add origin https://github.com/TON_PSEUDO/NOM_DU_REPO.git
```

Exemple si ton pseudo est `jean2025` et le repo `Gestion_SColaire` :

```bash
git remote add origin https://github.com/jean2025/Gestion_SColaire.git
```

---

## Étape 5 : Envoyer le code sur GitHub (push)

```bash
git push -u origin main
```

Si GitHub te demande de t’authentifier :
- Utilise ton **pseudo GitHub** et un **Personal Access Token** (mot de passe) au lieu de ton mot de passe compte.
- Pour créer un token : GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.

------

## Récapitulatif des commandes (à adapter)

```bash
# 1. Identité (une fois pour toutes)
git config --global user.email "ton@email.com"
git config --global user.name "Ton Nom"

# 2. Premier commit (dans le dossier du projet)
cd /home/jean/Bureau/Gestion_SColaire
git commit -m "Initial commit: Gestion Scolaire - backend Node/Express, frontend Vue.js, base MySQL"

# 3. Lien avec GitHub (remplace TON_PSEUDO et NOM_DU_REPO)
git remote add origin https://github.com/TON_PSEUDO/NOM_DU_REPO.git

# 4. Envoi sur GitHub
git push -u origin main
```

Ensuite, à chaque modification :

```bash
git add .
git commit -m "Description de la modification"
git push
```

---

## Vérifications utiles

- **Voir l’état** : `git status`
- **Voir le remote** : `git remote -v`
- **Voir la branche** : `git branch`

Si tu as une erreur (conflit, refus de push, etc.), copie le message d’erreur et on pourra le corriger étape par étape.
