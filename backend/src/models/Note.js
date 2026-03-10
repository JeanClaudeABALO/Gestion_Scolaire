const db = require('../config/database');

class Note {
  static async create(noteData) {
    const { eleve_id, matiere_id, valeur, type, trimestre } = noteData;
    const [result] = await db.execute(
      'INSERT INTO notes (eleve_id, matiere_id, valeur, type, trimestre) VALUES (?, ?, ?, ?, ?)',
      [eleve_id, matiere_id, valeur, type, trimestre || 1]
    );
    return result.insertId;
  }

  static async update(id, noteData) {
    const { valeur, type, trimestre } = noteData;
    await db.execute(
      'UPDATE notes SET valeur = ?, type = ?, trimestre = ? WHERE id = ?',
      [valeur, type, trimestre || 1, id]
    );
    return true;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT n.*, e.nom as eleve_nom, e.prenom as eleve_prenom, 
              m.nom as matiere_nom, m.professeur_id
       FROM notes n
       INNER JOIN eleves e ON e.id = n.eleve_id
       INNER JOIN matieres m ON m.id = n.matiere_id
       WHERE n.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByMatiere(matiere_id) {
    const [rows] = await db.execute(
      `SELECT n.id, n.valeur, n.type, n.trimestre, n.date_saisie,
              e.id as eleve_id, e.nom as eleve_nom, e.prenom as eleve_prenom
       FROM notes n
       INNER JOIN eleves e ON e.id = n.eleve_id
       WHERE n.matiere_id = ?
       ORDER BY e.nom, e.prenom, n.trimestre, n.date_saisie DESC`,
      [matiere_id]
    );
    return rows;
  }

  // Obtenir les notes d'un élève pour une matière et un trimestre
  static async findByEleveMatiereTrimestre(eleve_id, matiere_id, trimestre) {
    const [rows] = await db.execute(
      `SELECT n.id, n.valeur, n.type, n.trimestre, n.date_saisie
       FROM notes n
       WHERE n.eleve_id = ? AND n.matiere_id = ? AND n.trimestre = ?
       ORDER BY n.type, n.date_saisie`,
      [eleve_id, matiere_id, trimestre]
    );
    return rows;
  }

  // Obtenir toutes les notes d'un élève pour une matière (tous trimestres)
  static async findByEleveMatiere(eleve_id, matiere_id) {
    const [rows] = await db.execute(
      `SELECT n.id, n.valeur, n.type, n.trimestre, n.date_saisie
       FROM notes n
       WHERE n.eleve_id = ? AND n.matiere_id = ?
       ORDER BY n.trimestre, n.type, n.date_saisie`,
      [eleve_id, matiere_id]
    );
    return rows;
  }

  static async findAll() {
    const [rows] = await db.execute(
      `SELECT n.id, n.valeur, n.type, n.date_saisie,
              e.id as eleve_id, e.nom as eleve_nom, e.prenom as eleve_prenom,
              m.id as matiere_id, m.nom as matiere_nom,
              c.nom as classe_nom,
              p.nom as professeur_nom, p.prenom as professeur_prenom
       FROM notes n
       INNER JOIN eleves e ON e.id = n.eleve_id
       INNER JOIN matieres m ON m.id = n.matiere_id
       INNER JOIN classes c ON c.id = m.classe_id
       INNER JOIN professeurs p ON p.id = m.professeur_id
       ORDER BY n.date_saisie DESC`
    );
    return rows;
  }

  static async delete(id) {
    await db.execute('DELETE FROM notes WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Note;
