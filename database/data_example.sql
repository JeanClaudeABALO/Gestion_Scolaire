-- =========================
-- Données d'exemple pour les tests
-- =========================

USE gestion_scolaire;

-- Nettoyage des données existantes (optionnel, décommentez si vous voulez tout réinitialiser)
-- ATTENTION: Cela supprimera toutes les données existantes !
-- DELETE FROM notes;
-- DELETE FROM eleves;
-- DELETE FROM matieres;
-- DELETE FROM classes;
-- DELETE FROM professeurs;
-- DELETE FROM filieres;

-- =========================
-- Filières
-- =========================
-- Insérer les filières si elles n'existent pas déjà
INSERT INTO filieres (nom) 
SELECT 'Informatique' WHERE NOT EXISTS (SELECT 1 FROM filieres WHERE nom = 'Informatique');

INSERT INTO filieres (nom) 
SELECT 'Mathématiques' WHERE NOT EXISTS (SELECT 1 FROM filieres WHERE nom = 'Mathématiques');

INSERT INTO filieres (nom) 
SELECT 'Sciences' WHERE NOT EXISTS (SELECT 1 FROM filieres WHERE nom = 'Sciences');

-- =========================
-- Professeurs
-- =========================
INSERT IGNORE INTO professeurs (nom, prenom, code_professeur, role) VALUES 
('Dupont', 'Jean', 'PROF001', 'PROF'),
('Martin', 'Marie', 'PROF002', 'PROF'),
('Bernard', 'Pierre', 'ADMIN001', 'ADMIN'),
('Dubois', 'Sophie', 'PROF003', 'PROF'),
('Lefebvre', 'Antoine', 'PROF004', 'PROF'),
('Moreau', 'Claire', 'PROF005', 'PROF');

-- =========================
-- Classes
-- =========================
-- Utiliser les IDs des filières dynamiquement (vérifier l'existence avant insertion)
INSERT INTO classes (nom, filiere_id) 
SELECT '6e A', f.id 
FROM filieres f 
WHERE f.nom = 'Informatique' 
  AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.nom = '6e A' AND c.filiere_id = f.id)
LIMIT 1;

INSERT INTO classes (nom, filiere_id) 
SELECT '6e B', f.id 
FROM filieres f 
WHERE f.nom = 'Informatique' 
  AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.nom = '6e B' AND c.filiere_id = f.id)
LIMIT 1;

INSERT INTO classes (nom, filiere_id) 
SELECT '5e A', f.id 
FROM filieres f 
WHERE f.nom = 'Informatique' 
  AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.nom = '5e A' AND c.filiere_id = f.id)
LIMIT 1;

INSERT INTO classes (nom, filiere_id) 
SELECT '4e A', f.id 
FROM filieres f 
WHERE f.nom = 'Informatique' 
  AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.nom = '4e A' AND c.filiere_id = f.id)
LIMIT 1;

INSERT INTO classes (nom, filiere_id) 
SELECT '3e A', f.id 
FROM filieres f 
WHERE f.nom = 'Informatique' 
  AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.nom = '3e A' AND c.filiere_id = f.id)
LIMIT 1;

INSERT INTO classes (nom, filiere_id) 
SELECT 'Terminale D', f.id 
FROM filieres f 
WHERE f.nom = 'Informatique' 
  AND NOT EXISTS (SELECT 1 FROM classes c WHERE c.nom = 'Terminale D' AND c.filiere_id = f.id)
LIMIT 1;

-- =========================
-- Élèves
-- =========================
-- Note: Les codes secrets sont générés automatiquement lors de l'import via fichier
-- Ces codes sont des exemples. En production, utilisez l'import via fichier Excel/Word
INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Durand', 'Pierre', c.id, 'ELEVE001' 
FROM classes c WHERE c.nom = '6e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Moreau', 'Julie', c.id, 'ELEVE002' 
FROM classes c WHERE c.nom = '6e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Lefebvre', 'Thomas', c.id, 'ELEVE003' 
FROM classes c WHERE c.nom = '6e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Garcia', 'Emma', c.id, 'ELEVE004' 
FROM classes c WHERE c.nom = '6e B' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Roux', 'Lucas', c.id, 'ELEVE005' 
FROM classes c WHERE c.nom = '6e B' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Simon', 'Léa', c.id, 'ELEVE006' 
FROM classes c WHERE c.nom = '5e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Bernard', 'Hugo', c.id, 'ELEVE007' 
FROM classes c WHERE c.nom = '5e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Petit', 'Camille', c.id, 'ELEVE008' 
FROM classes c WHERE c.nom = '4e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Robert', 'Alexandre', c.id, 'ELEVE009' 
FROM classes c WHERE c.nom = '4e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Richard', 'Manon', c.id, 'ELEVE010' 
FROM classes c WHERE c.nom = '3e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Durand', 'Nathan', c.id, 'ELEVE011' 
FROM classes c WHERE c.nom = '3e A' LIMIT 1;

INSERT IGNORE INTO eleves (nom, prenom, classe_id, code_secret) 
SELECT 'Dubois', 'Inès', c.id, 'ELEVE012' 
FROM classes c WHERE c.nom = 'Terminale D' LIMIT 1;

-- =========================
-- Matières
-- =========================
-- Utiliser les IDs dynamiques des classes et professeurs
INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Mathématiques', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e A' AND p.code_professeur = 'PROF001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Français', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e A' AND p.code_professeur = 'PROF002' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Informatique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e A' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Anglais', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e A' AND p.code_professeur = 'PROF003' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Mathématiques', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e B' AND p.code_professeur = 'PROF001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Français', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e B' AND p.code_professeur = 'PROF002' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Informatique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '6e B' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Mathématiques', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '5e A' AND p.code_professeur = 'PROF001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Informatique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '5e A' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Physique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '5e A' AND p.code_professeur = 'PROF004' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Mathématiques', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '4e A' AND p.code_professeur = 'PROF001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Informatique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '4e A' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Algorithmique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '4e A' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Mathématiques', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '3e A' AND p.code_professeur = 'PROF001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Informatique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '3e A' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Base de données', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = '3e A' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Mathématiques', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = 'Terminale D' AND p.code_professeur = 'PROF001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Informatique', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = 'Terminale D' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Développement Web', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = 'Terminale D' AND p.code_professeur = 'ADMIN001' LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id) 
SELECT 'Réseaux', c.id, p.id
FROM classes c, professeurs p 
WHERE c.nom = 'Terminale D' AND p.code_professeur = 'PROF005' LIMIT 1;

-- =========================
-- Notes
-- =========================
-- Les notes utilisent les IDs des élèves et matières dynamiquement
-- Note: Cette section peut échouer si les élèves ou matières n'existent pas
-- Il est recommandé d'exécuter les sections précédentes d'abord

INSERT IGNORE INTO notes (eleve_id, matiere_id, valeur, type)
SELECT e.id, m.id, 15.5, 'Devoir'
FROM eleves e, matieres m, classes c
WHERE e.nom = 'Durand' AND e.prenom = 'Pierre' 
  AND c.nom = '6e A' AND e.classe_id = c.id
  AND m.nom = 'Mathématiques' AND m.classe_id = c.id LIMIT 1;

INSERT IGNORE INTO notes (eleve_id, matiere_id, valeur, type)
SELECT e.id, m.id, 18.0, 'Examen'
FROM eleves e, matieres m, classes c
WHERE e.nom = 'Durand' AND e.prenom = 'Pierre' 
  AND c.nom = '6e A' AND e.classe_id = c.id
  AND m.nom = 'Mathématiques' AND m.classe_id = c.id LIMIT 1;

INSERT IGNORE INTO notes (eleve_id, matiere_id, valeur, type)
SELECT e.id, m.id, 14.0, 'Interrogation'
FROM eleves e, matieres m, classes c
WHERE e.nom = 'Durand' AND e.prenom = 'Pierre' 
  AND c.nom = '6e A' AND e.classe_id = c.id
  AND m.nom = 'Français' AND m.classe_id = c.id LIMIT 1;

INSERT IGNORE INTO notes (eleve_id, matiere_id, valeur, type)
SELECT e.id, m.id, 16.5, 'Devoir'
FROM eleves e, matieres m, classes c
WHERE e.nom = 'Durand' AND e.prenom = 'Pierre' 
  AND c.nom = '6e A' AND e.classe_id = c.id
  AND m.nom = 'Informatique' AND m.classe_id = c.id LIMIT 1;

INSERT IGNORE INTO notes (eleve_id, matiere_id, valeur, type)
SELECT e.id, m.id, 17.0, 'Examen'
FROM eleves e, matieres m, classes c
WHERE e.nom = 'Durand' AND e.prenom = 'Pierre' 
  AND c.nom = '6e A' AND e.classe_id = c.id
  AND m.nom = 'Informatique' AND m.classe_id = c.id LIMIT 1;

-- Ajouter d'autres notes de la même manière...
-- (Les autres notes suivent le même pattern)

-- =========================
-- Vérification des données
-- =========================
SELECT 'Filières' as TableName, COUNT(*) as Count FROM filieres
UNION ALL
SELECT 'Classes', COUNT(*) FROM classes
UNION ALL
SELECT 'Professeurs', COUNT(*) FROM professeurs
UNION ALL
SELECT 'Élèves', COUNT(*) FROM eleves
UNION ALL
SELECT 'Matières', COUNT(*) FROM matieres
UNION ALL
SELECT 'Notes', COUNT(*) FROM notes;
