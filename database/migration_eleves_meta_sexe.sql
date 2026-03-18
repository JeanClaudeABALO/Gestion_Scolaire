-- Ajout d'une table meta pour gérer le sexe des élèves
-- Objectif : ne pas toucher à la table eleves (pas d'attribut direct)

CREATE TABLE IF NOT EXISTS eleves_meta (
  eleve_id INT PRIMARY KEY,
  sexe ENUM('F','M') NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_eleves_meta_eleve
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
    ON DELETE CASCADE
);

