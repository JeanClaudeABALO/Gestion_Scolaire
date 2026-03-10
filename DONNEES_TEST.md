# Données de Test pour l'Application

## 🔐 Codes d'accès

### 👨‍🏫 Professeurs

| Nom | Prénom | Code | Rôle | Accès |
|-----|--------|------|------|-------|
| Dupont | Jean | `PROF001` | PROF | Espace Professeur |
| Martin | Marie | `PROF002` | PROF | Espace Professeur |
| Dubois | Sophie | `PROF003` | PROF | Espace Professeur |
| Lefebvre | Antoine | `PROF004` | PROF | Espace Professeur |
| Moreau | Claire | `PROF005` | PROF | Espace Professeur |

### 🧑‍💼 Responsable (Admin)

| Nom | Prénom | Code | Rôle | Accès |
|-----|--------|------|------|-------|
| Bernard | Pierre | `ADMIN001` | ADMIN | Tableau de bord complet (toutes les données + Import d'élèves) |

### 👨‍👩‍👧 Parents (via code secret élève)

| Élève | Code Secret | Accès |
|-------|-------------|-------|
| Pierre Durand | `ELEVE001` | Notes de Pierre Durand |
| Julie Moreau | `ELEVE002` | Notes de Julie Moreau |
| Thomas Lefebvre | `ELEVE003` | Notes de Thomas Lefebvre |
| Emma Garcia | `ELEVE004` | Notes de Emma Garcia |
| Lucas Roux | `ELEVE005` | Notes de Lucas Roux |
| Léa Simon | `ELEVE006` | Notes de Léa Simon |
| Hugo Bernard | `ELEVE007` | Notes de Hugo Bernard |
| Camille Petit | `ELEVE008` | Notes de Camille Petit |
| Alexandre Robert | `ELEVE009` | Notes de Alexandre Robert |
| Manon Richard | `ELEVE010` | Notes de Manon Richard |
| Nathan Durand | `ELEVE011` | Notes de Nathan Durand |
| Inès Dubois | `ELEVE012` | Notes de Inès Dubois |

## 📚 Structure des données

### Filières
- **Informatique** (ID: 1)
- **Mathématiques** (ID: 2)
- **Sciences** (ID: 3)

### Classes
- **6e A** (ID: 1) - Filière Informatique
- **6e B** (ID: 2) - Filière Informatique
- **5e A** (ID: 3) - Filière Informatique
- **4e A** (ID: 4) - Filière Informatique
- **3e A** (ID: 5) - Filière Informatique
- **Terminale D** (ID: 6) - Filière Informatique

### Matières assignées

**Classe 6e A :**
- Mathématiques (Prof: Jean Dupont - PROF001)
- Français (Prof: Marie Martin - PROF002)
- Informatique (Prof: Pierre Bernard - ADMIN001)
- Anglais (Prof: Sophie Dubois - PROF003)

**Classe 6e B :**
- Mathématiques (Prof: Jean Dupont - PROF001)
- Français (Prof: Marie Martin - PROF002)
- Informatique (Prof: Pierre Bernard - ADMIN001)

**Classe 5e A :**
- Mathématiques (Prof: Jean Dupont - PROF001)
- Informatique (Prof: Pierre Bernard - ADMIN001)
- Physique (Prof: Antoine Lefebvre - PROF004)

**Classe 4e A :**
- Mathématiques (Prof: Jean Dupont - PROF001)
- Informatique (Prof: Pierre Bernard - ADMIN001)
- Algorithmique (Prof: Pierre Bernard - ADMIN001)

**Classe 3e A :**
- Mathématiques (Prof: Jean Dupont - PROF001)
- Informatique (Prof: Pierre Bernard - ADMIN001)
- Base de données (Prof: Pierre Bernard - ADMIN001)

**Terminale D :**
- Mathématiques (Prof: Jean Dupont - PROF001)
- Informatique (Prof: Pierre Bernard - ADMIN001)
- Développement Web (Prof: Pierre Bernard - ADMIN001)
- Réseaux (Prof: Claire Moreau - PROF005)

## 📝 Notes existantes

Les notes sont réparties sur plusieurs élèves et matières. Chaque élève a au moins 2-3 notes dans différentes matières.

## 🚀 Utilisation

### Pour tester en tant que Professeur
1. Allez sur http://localhost:3000
2. Sélectionnez l'onglet "Professeur / Responsable"
3. Entrez le code : `PROF001`, `PROF002`, `PROF003`, `PROF004` ou `PROF005`
4. Vous verrez vos classes et matières assignées

### Pour tester en tant que Responsable (Admin)
1. Allez sur http://localhost:3000
2. Sélectionnez l'onglet "Professeur / Responsable"
3. Entrez le code : `ADMIN001`
4. Vous verrez toutes les données du système
5. **Nouvelle fonctionnalité** : Allez dans "Importer Élèves" pour tester l'import via fichier Excel/Word

### Pour tester en tant que Parent
1. Allez sur http://localhost:3000
2. Sélectionnez l'onglet "Parent"
3. Entrez le code secret : `ELEVE001`, `ELEVE002`, etc.
4. Vous verrez les notes de l'élève correspondant

## 📤 Import d'élèves (Nouvelle fonctionnalité)

### Pour tester l'import d'élèves :
1. Connectez-vous en tant qu'admin (`ADMIN001`)
2. Allez dans la section **"Importer Élèves"**
3. Téléversez le fichier `database/exemple_import_eleves.csv` (ouvrez-le dans Excel et sauvegardez en .xlsx)
4. Ou créez votre propre fichier Excel avec les colonnes : **Nom, Prénom, Classe, Filière**
5. Les codes secrets seront générés automatiquement pour chaque élève

### Format du fichier Excel :
| Nom | Prénom | Classe | Filière |
|-----|--------|--------|---------|
| Durand | Pierre | 6e A | Informatique |
| Moreau | Julie | 6e A | Informatique |

**Important :**
- La première ligne doit contenir les en-têtes
- Les filières et classes seront créées automatiquement si elles n'existent pas
- Chaque élève recevra un code secret unique de 8 caractères
