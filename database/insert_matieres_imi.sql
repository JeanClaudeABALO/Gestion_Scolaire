-- ============================================
-- Insertion des matières par classe (IMI)
-- ============================================
-- 2nde IMI  : MA, SEV, ALGO, SER, LA, AS, EE
-- 1ère IMI  : MA, BD, ALGO, Programmation Web, Cheminement Professionnel, LA, IP, RI, EE
-- Tle IMI   : MA, BD, Programmation, Optimisation, AL, RP, RI, EE, MG
-- ============================================
-- Prérequis : Filière IMI et classes (SECONDE IMI, PREMIERE IMI, TERMINALE IMI)
--             et au moins un professeur en base (pour professeur_id).
-- ============================================

USE gestion_scolaire;

-- Variable : on utilise le premier professeur (ou admin) pour associer les matières
-- Vous pourrez réattribuer les matières depuis l'interface admin ensuite.

-- ============================================
-- SECONDE IMI (2nde IMI) - 7 matières
-- ============================================
INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'MA', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'SEV', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'ALGO', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'SER', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'LA', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'AS', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'EE', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'SECONDE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

-- ============================================
-- PREMIERE IMI (1ère IMI) - 9 matières
-- ============================================
INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'MA', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'BD', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'ALGO', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'Programmation Web', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'Cheminement Professionnel', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'LA', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'IP', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'RI', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'EE', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'PREMIERE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

-- ============================================
-- TERMINALE IMI (Tle IMI) - 9 matières
-- ============================================
INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'MA', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'BD', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'Programmation', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'Optimisation', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'AL', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'RP', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'RI', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'EE', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

INSERT IGNORE INTO matieres (nom, classe_id, professeur_id)
SELECT 'MG', c.id, (SELECT id FROM professeurs ORDER BY id LIMIT 1)
FROM classes c WHERE c.nom = 'TERMINALE IMI' AND c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI') LIMIT 1;

-- ============================================
-- Vérification
-- ============================================
SELECT 
  c.nom AS classe, 
  COUNT(m.id) AS nombre_matieres, 
  GROUP_CONCAT(m.nom ORDER BY m.nom SEPARATOR ', ') AS matieres
FROM classes c
LEFT JOIN matieres m ON m.classe_id = c.id
WHERE c.filiere_id = (SELECT id FROM filieres WHERE nom = 'IMI')
GROUP BY c.id, c.nom
ORDER BY c.nom;
