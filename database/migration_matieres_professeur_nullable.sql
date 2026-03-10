USE gestion_scolaire;

-- Rendre professeur_id optionnel pour pouvoir créer des matières
-- sans leur associer immédiatement un professeur
ALTER TABLE matieres
  MODIFY professeur_id INT NULL;

