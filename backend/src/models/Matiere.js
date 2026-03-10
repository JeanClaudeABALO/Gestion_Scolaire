const db = require('../config/database');

class Matiere {
  static async findAll() {
    const [rows] = await db.execute(
      `SELECT m.id, m.nom, m.classe_id, m.professeur_id,
              c.nom as classe_nom,
              p.nom as professeur_nom, p.prenom as professeur_prenom
       FROM matieres m
       INNER JOIN classes c ON c.id = m.classe_id
       LEFT JOIN professeurs p ON p.id = m.professeur_id
       ORDER BY c.nom, m.nom`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT m.*, c.nom as classe_nom,
              p.nom as professeur_nom, p.prenom as professeur_prenom
       FROM matieres m
       INNER JOIN classes c ON c.id = m.classe_id
       LEFT JOIN professeurs p ON p.id = m.professeur_id
       WHERE m.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByProfesseur(professeur_id) {
    const [rows] = await db.execute(
      `SELECT m.id, m.nom, m.classe_id, c.nom as classe_nom
       FROM matieres m
       INNER JOIN classes c ON c.id = m.classe_id
       WHERE m.professeur_id = ?
       ORDER BY c.nom, m.nom`,
      [professeur_id]
    );
    return rows;
  }

  // Obtenir les matières d'un professeur pour une classe spécifique
  static async findByProfesseurAndClasse(professeur_id, classe_id) {
    const [rows] = await db.execute(
      `SELECT m.id, m.nom, m.classe_id, c.nom as classe_nom
       FROM matieres m
       INNER JOIN classes c ON c.id = m.classe_id
       WHERE m.professeur_id = ? AND m.classe_id = ?
       ORDER BY m.nom`,
      [professeur_id, classe_id]
    );
    return rows;
  }

  // Créer une nouvelle matière
  static async create(nom, classe_id, professeur_id) {
    const [result] = await db.execute(
      'INSERT INTO matieres (nom, classe_id, professeur_id) VALUES (?, ?, ?)',
      [nom, classe_id, professeur_id]
    );
    return result.insertId;
  }
}

module.exports = Matiere;
