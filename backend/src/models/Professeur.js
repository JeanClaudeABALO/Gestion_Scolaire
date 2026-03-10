const db = require('../config/database');

class Professeur {
  static async findByCode(code_professeur) {
    const [rows] = await db.execute(
      'SELECT * FROM professeurs WHERE code_professeur = ?',
      [code_professeur]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM professeurs WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    const [rows] = await db.execute(
      'SELECT id, nom, prenom, code_professeur, role FROM professeurs ORDER BY nom, prenom'
    );
    return rows;
  }

  static async getClassesByProfesseur(professeur_id) {
    const [rows] = await db.execute(
      `SELECT DISTINCT c.id, c.nom, c.filiere_id, f.nom as filiere_nom
       FROM classes c
       INNER JOIN matieres m ON m.classe_id = c.id
       INNER JOIN filieres f ON f.id = c.filiere_id
       WHERE m.professeur_id = ?
       ORDER BY c.nom`,
      [professeur_id]
    );
    return rows;
  }

  static async getMatieresByProfesseur(professeur_id) {
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

  static async create(professeurData) {
    const { nom, prenom, code_professeur, role } = professeurData;
    const [result] = await db.execute(
      'INSERT INTO professeurs (nom, prenom, code_professeur, role) VALUES (?, ?, ?, ?)',
      [nom, prenom, code_professeur, role]
    );
    return result.insertId;
  }

  static async updateIdentity(id, nom, prenom) {
    await db.execute(
      'UPDATE professeurs SET nom = ?, prenom = ? WHERE id = ?',
      [nom, prenom, id]
    );
    return true;
  }

  static async countAdmins() {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM professeurs WHERE role = 'ADMIN'"
    );
    return rows[0].count;
  }

  static async updateCode(id, newCode) {
    await db.execute(
      'UPDATE professeurs SET code_professeur = ? WHERE id = ?',
      [newCode, id]
    );
    return true;
  }

  static async generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let exists = true;
    
    while (exists) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      
      const [rows] = await db.execute(
        'SELECT COUNT(*) as count FROM professeurs WHERE code_professeur = ?',
        [code]
      );
      exists = rows[0].count > 0;
    }
    
    return code;
  }
}

module.exports = Professeur;
