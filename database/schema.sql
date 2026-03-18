-- =========================
-- Base de données
-- =========================
CREATE DATABASE IF NOT EXISTS gestion_scolaire
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE gestion_scolaire;

-- =========================
-- Filière
-- =========================
CREATE TABLE filieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- =========================
-- Professeurs
-- =========================
CREATE TABLE professeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    code_professeur VARCHAR(50) NOT NULL UNIQUE,
    role ENUM('PROF', 'ADMIN') DEFAULT 'PROF'
);

-- =========================
-- Classes
-- =========================
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(50) NOT NULL,
    filiere_id INT NOT NULL,
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
        ON DELETE CASCADE
);

-- =========================
-- Élèves
-- =========================
CREATE TABLE eleves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    classe_id INT NOT NULL,
    code_secret VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (classe_id) REFERENCES classes(id)
        ON DELETE CASCADE
);

-- =========================
-- Matières
-- =========================
CREATE TABLE matieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    classe_id INT NOT NULL,
    professeur_id INT NULL,
    FOREIGN KEY (classe_id) REFERENCES classes(id)
        ON DELETE CASCADE,
    FOREIGN KEY (professeur_id) REFERENCES professeurs(id)
        ON DELETE CASCADE
);

-- =========================
-- Notes
-- =========================
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT NOT NULL,
    matiere_id INT NOT NULL,
    valeur DECIMAL(5,2) NOT NULL,
    type ENUM('Devoir', 'Interrogation', 'Examen') NOT NULL,
    trimestre INT NOT NULL DEFAULT 1,
    date_saisie TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
        ON DELETE CASCADE,
    FOREIGN KEY (matiere_id) REFERENCES matieres(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_trimestre CHECK (trimestre IN (1, 2, 3))
);

-- Index pour améliorer les performances
CREATE INDEX idx_notes_trimestre ON notes(trimestre);
CREATE INDEX idx_notes_eleve_matiere_trimestre ON notes(eleve_id, matiere_id, trimestre);

-- =========================
-- Métadonnées Élèves (sexe, etc.)
-- =========================
CREATE TABLE IF NOT EXISTS eleves_meta (
    eleve_id INT PRIMARY KEY,
    sexe ENUM('F','M') NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
        ON DELETE CASCADE
);
