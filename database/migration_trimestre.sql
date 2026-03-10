-- =========================
-- Migration : Ajout du champ trimestre aux notes
-- =========================

USE gestion_scolaire;

-- Ajouter la colonne trimestre à la table notes
ALTER TABLE notes 
ADD COLUMN trimestre INT NOT NULL DEFAULT 1 
AFTER type,
ADD CONSTRAINT chk_trimestre CHECK (trimestre IN (1, 2, 3));

-- Ajouter un index pour améliorer les performances des requêtes
CREATE INDEX idx_notes_trimestre ON notes(trimestre);
CREATE INDEX idx_notes_eleve_matiere_trimestre ON notes(eleve_id, matiere_id, trimestre);

-- Mettre à jour les notes existantes pour qu'elles soient dans le trimestre 1 par défaut
UPDATE notes SET trimestre = 1 WHERE trimestre IS NULL OR trimestre = 0;
