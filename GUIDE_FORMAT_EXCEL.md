# Guide du Format Excel pour l'Import

## ⚠️ Format Requis

Votre fichier Excel **DOIT** avoir exactement ces colonnes dans la **première ligne** :

| Nom | Prénom | Classe | Filière |
|-----|--------|--------|---------|
| Durand | Pierre | 6e A | Informatique |
| Moreau | Julie | 6e A | Informatique |

## ✅ Format Correct

```
Nom        | Prénom  | Classe     | Filière
-----------|---------|------------|----------
Durand     | Pierre  | 6e A       | Informatique
Moreau     | Julie   | 6e A       | Informatique
```

## ❌ Formats Incorrects

- Colonnes dans un ordre différent
- Noms de colonnes différents (ex: "NOM" au lieu de "Nom")
- Espaces supplémentaires dans les noms de colonnes
- Première ligne vide ou sans en-têtes

## 📝 Instructions

1. Ouvrez Excel ou LibreOffice Calc
2. Créez un nouveau fichier
3. Dans la **première ligne**, écrivez exactement : `Nom`, `Prénom`, `Classe`, `Filière`
4. À partir de la **deuxième ligne**, ajoutez les données des élèves
5. Sauvegardez en format `.xlsx` (Excel 2007+)

## 🔍 Vérification

Avant de téléverser, vérifiez que :
- ✅ La première ligne contient : Nom, Prénom, Classe, Filière
- ✅ Toutes les colonnes sont remplies pour chaque élève
- ✅ Pas d'espaces en début/fin de cellules
- ✅ Le fichier est en format .xlsx ou .xls
