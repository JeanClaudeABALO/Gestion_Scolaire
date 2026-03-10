const db = require('../config/database');

class Classe {
  static async findAll() {
    const [rows] = await db.execute(
      `SELECT c.id, c.nom, c.filiere_id, f.nom as filiere_nom
       FROM classes c
       INNER JOIN filieres f ON f.id = c.filiere_id
       ORDER BY c.nom`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      `SELECT c.*, f.nom as filiere_nom
       FROM classes c
       INNER JOIN filieres f ON f.id = c.filiere_id
       WHERE c.id = ?`,
      [id]
    );
    return rows[0];
  }
}

module.exports = Classe;
