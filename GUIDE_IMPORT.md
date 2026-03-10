# Guide d'Import des Élèves

## 📋 Format du fichier

L'import d'élèves se fait via un fichier **Excel** (.xlsx, .xls) ou **Word** (.docx).

### Format Excel (Recommandé)

Le fichier Excel doit contenir les colonnes suivantes dans la première ligne :

| Nom | Prénom | Classe | Filière |
|-----|--------|--------|---------|
| Durand | Pierre | 6e A | Informatique |
| Moreau | Julie | 6e A | Informatique |

**Important :**
- La première ligne doit contenir les en-têtes (Nom, Prénom, Classe, Filière)
- Les noms de colonnes peuvent être en majuscules, minuscules ou avec accents
- Chaque ligne suivante représente un élève

### Format Word

Pour les fichiers Word, le format attendu est :
```
Nom, Prénom, Classe, Filière
Durand, Pierre, 6e A, Informatique
Moreau, Julie, 6e A, Informatique
```

Une ligne par élève, avec les valeurs séparées par des virgules.

## 🚀 Utilisation

1. Connectez-vous en tant qu'**Admin** (code : `ADMIN001`)
2. Allez dans la section **"Importer Élèves"**
3. Cliquez sur **"Cliquez pour sélectionner un fichier"**
4. Sélectionnez votre fichier Excel ou Word
5. Cliquez sur **"Téléverser et Importer"**

## ✨ Fonctionnalités

- **Génération automatique de codes secrets** : Chaque élève reçoit un code secret unique de 8 caractères
- **Création automatique** : Les filières et classes sont créées automatiquement si elles n'existent pas
- **Détection des doublons** : Les élèves déjà existants ne seront pas créés en double
- **Rapport détaillé** : Après l'import, vous verrez :
  - Le nombre d'élèves créés avec succès
  - Les codes secrets générés
  - Les erreurs éventuelles avec les raisons

## 📝 Exemple de fichier

Un fichier d'exemple est disponible dans `database/exemple_eleves.csv`. Vous pouvez l'ouvrir dans Excel et l'utiliser comme modèle.

## ⚠️ Notes importantes

- Les codes secrets sont générés automatiquement et sont uniques
- Si un élève existe déjà (même nom, prénom et classe), il ne sera pas créé en double
- Les filières et classes sont créées automatiquement si elles n'existent pas
- Le fichier ne doit pas dépasser 10 MB
