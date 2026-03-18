const db = require('../config/database');

class Eleve {
  static async ensureMetaTable() {
    // Créer la table meta si elle n'existe pas encore (évite les 500)
    await db.execute(
      `CREATE TABLE IF NOT EXISTS eleves_meta (
        eleve_id INT PRIMARY KEY,
        sexe ENUM('F','M') NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (eleve_id) REFERENCES eleves(id)
          ON DELETE CASCADE
      )`
    );
  }

  static async executeWithMetaFallback(withMetaSql, withoutMetaSql, params = []) {
    try {
      const [rows] = await db.execute(withMetaSql, params);
      return rows;
    } catch (err) {
      // Si la table meta n'existe pas encore, ne pas bloquer l'API
      if (err && err.code === 'ER_NO_SUCH_TABLE' && String(err.sqlMessage || '').includes('eleves_meta')) {
        const [rows] = await db.execute(withoutMetaSql, params);
        // Ajouter le champ sexe pour garder une forme stable côté frontend
        return rows.map(r => ({ ...r, sexe: null }));
      }
      throw err;
    }
  }

  static normalizeSexe(sexe) {
    if (sexe === undefined || sexe === null || sexe === '') return null;
    const s = String(sexe).trim().toUpperCase();
    if (s === 'F' || s === 'FEMME' || s === 'FEMININ' || s === 'FÉMININ') return 'F';
    if (s === 'M' || s === 'H' || s === 'HOMME' || s === 'MASCULIN') return 'M';
    return null;
  }

  static async setSexe(eleve_id, sexe) {
    const s = this.normalizeSexe(sexe);
    // Autoriser null pour "effacer" la valeur
    try {
      await db.execute(
        `INSERT INTO eleves_meta (eleve_id, sexe)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE sexe = VALUES(sexe), updated_at = CURRENT_TIMESTAMP`,
        [eleve_id, s]
      );
    } catch (err) {
      if (err && err.code === 'ER_NO_SUCH_TABLE' && String(err.sqlMessage || '').includes('eleves_meta')) {
        await this.ensureMetaTable();
        await db.execute(
          `INSERT INTO eleves_meta (eleve_id, sexe)
           VALUES (?, ?)
           ON DUPLICATE KEY UPDATE sexe = VALUES(sexe), updated_at = CURRENT_TIMESTAMP`,
          [eleve_id, s]
        );
      } else {
        throw err;
      }
    }
    return s;
  }

  static async findByCodeSecret(code_secret) {
    const [rows] = await db.execute(
      'SELECT * FROM eleves WHERE code_secret = ?',
      [code_secret]
    );
    return rows[0];
  }

  static async findById(id) {
    const rows = await this.executeWithMetaFallback(
      `SELECT e.*, c.nom as classe_nom, f.nom as filiere_nom, em.sexe as sexe
       FROM eleves e
       INNER JOIN classes c ON c.id = e.classe_id
       INNER JOIN filieres f ON f.id = c.filiere_id
       LEFT JOIN eleves_meta em ON em.eleve_id = e.id
       WHERE e.id = ?`,
      `SELECT e.*, c.nom as classe_nom, f.nom as filiere_nom
       FROM eleves e
       INNER JOIN classes c ON c.id = e.classe_id
       INNER JOIN filieres f ON f.id = c.filiere_id
       WHERE e.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAll() {
    return this.executeWithMetaFallback(
      `SELECT e.id, e.nom, e.prenom, e.code_secret, e.classe_id, c.nom as classe_nom, em.sexe as sexe
       FROM eleves e
       INNER JOIN classes c ON c.id = e.classe_id
       LEFT JOIN eleves_meta em ON em.eleve_id = e.id
       ORDER BY c.nom, e.nom, e.prenom`,
      `SELECT e.id, e.nom, e.prenom, e.code_secret, e.classe_id, c.nom as classe_nom
       FROM eleves e
       INNER JOIN classes c ON c.id = e.classe_id
       ORDER BY c.nom, e.nom, e.prenom`,
      []
    );
  }

  static async findByClasse(classe_id) {
    return this.executeWithMetaFallback(
      `SELECT e.id, e.nom, e.prenom, e.code_secret, em.sexe as sexe
       FROM eleves e
       LEFT JOIN eleves_meta em ON em.eleve_id = e.id
       WHERE e.classe_id = ?
       ORDER BY e.nom, e.prenom`,
      `SELECT e.id, e.nom, e.prenom, e.code_secret
       FROM eleves e
       WHERE e.classe_id = ?
       ORDER BY e.nom, e.prenom`,
      [classe_id]
    );
  }

  // Obtenir les élèves d'une classe avec leurs notes pour une matière spécifique
  static async findByClasseWithNotes(classe_id, matiere_id, trimestre) {
    return this.executeWithMetaFallback(
      `SELECT e.id, e.nom, e.prenom, e.code_secret, em.sexe as sexe,
              n.id as note_id, n.valeur, n.type, n.trimestre, n.date_saisie
       FROM eleves e
       LEFT JOIN eleves_meta em ON em.eleve_id = e.id
       LEFT JOIN notes n ON n.eleve_id = e.id 
         AND n.matiere_id = ? 
         AND n.trimestre = ?
       WHERE e.classe_id = ?
       ORDER BY e.nom, e.prenom, n.type, n.date_saisie`,
      `SELECT e.id, e.nom, e.prenom, e.code_secret,
              n.id as note_id, n.valeur, n.type, n.trimestre, n.date_saisie
       FROM eleves e
       LEFT JOIN notes n ON n.eleve_id = e.id 
         AND n.matiere_id = ? 
         AND n.trimestre = ?
       WHERE e.classe_id = ?
       ORDER BY e.nom, e.prenom, n.type, n.date_saisie`,
      [matiere_id, trimestre, classe_id]
    );
  }

  static async getNotesByEleve(eleve_id) {
    const [rows] = await db.execute(
      `SELECT n.id, n.valeur, n.type, n.trimestre, n.date_saisie,
              m.id as matiere_id, m.nom as matiere_nom,
              c.nom as classe_nom
       FROM notes n
       INNER JOIN matieres m ON m.id = n.matiere_id
       INNER JOIN classes c ON c.id = m.classe_id
       WHERE n.eleve_id = ?
       ORDER BY n.trimestre, n.date_saisie DESC`,
      [eleve_id]
    );
    return rows;
  }

  // Obtenir toutes les notes d'un élève organisées par matière avec calculs
  static async getNotesOrganiseesByEleve(eleve_id) {
    const Note = require('./Note');
    const eleve = await this.findById(eleve_id);
    if (!eleve) return null;

    // Obtenir toutes les matières de la classe de l'élève
    const [matieres] = await db.execute(
      `SELECT DISTINCT m.id, m.nom
       FROM matieres m
       INNER JOIN classes c ON c.id = m.classe_id
       WHERE c.id = ?
       ORDER BY m.nom`,
      [eleve.classe_id]
    );

    const matieresWithNotes = await Promise.all(
      matieres.map(async (matiere) => {
        // Pour chaque trimestre
        const trimestres = [1, 2, 3];
        const notesByTrimestre = await Promise.all(
          trimestres.map(async (trimestre) => {
            const notes = await Note.findByEleveMatiereTrimestre(eleve_id, matiere.id, trimestre);

            const interrogations = notes
              .filter(n => n.type === 'Interrogation')
              .slice(0, 5)
              .map(n => parseFloat(n.valeur));

            const devoirs = notes
              .filter(n => n.type === 'Devoir')
              .slice(0, 3)
              .map(n => parseFloat(n.valeur));

            // Moyenne des interrogations = somme(interros) / nb(interros)
            const sumInterrogations = interrogations.reduce((sum, note) => sum + note, 0);
            const moyenneInterrogations = interrogations.length > 0
              ? (sumInterrogations / interrogations.length).toFixed(2)
              : null;

            // Moyenne générale = (moyenneInterrogations + devoir1 + devoir2) / 3
            const devoir1 = devoirs[0] !== undefined ? devoirs[0] : null;
            const devoir2 = devoirs[1] !== undefined ? devoirs[1] : null;
            const moyenne = (moyenneInterrogations !== null && devoir1 !== null && devoir2 !== null)
              ? ((parseFloat(moyenneInterrogations) + devoir1 + devoir2) / 3).toFixed(2)
              : null;

            // Coefficient (par défaut 1)
            const coefficient = 1;
            const moyenneCoefficientee = moyenne ? (parseFloat(moyenne) * coefficient).toFixed(2) : null;

            return {
              trimestre,
              interrogations: [
                interrogations[0] || null,
                interrogations[1] || null,
                interrogations[2] || null,
                interrogations[3] || null,
                interrogations[4] || null
              ],
              moyenneInterrogations,
              devoirs: [
                devoirs[0] || null,
                devoirs[1] || null,
                devoirs[2] || null
              ],
              coefficient,
              moyenne,
              moyenneCoefficientee
            };
          })
        );

        return {
          matiere_id: matiere.id,
          matiere_nom: matiere.nom,
          trimestres: notesByTrimestre
        };
      })
    );

    return {
      eleve: {
        id: eleve.id,
        nom: eleve.nom,
        prenom: eleve.prenom,
        classe_nom: eleve.classe_nom,
        filiere_nom: eleve.filiere_nom
      },
      matieres: matieresWithNotes
    };
  }

  // Générer un code secret unique
  static async generateUniqueCodeSecret() {
    let code;
    let isUnique = false;
    while (!isUnique) {
      // Génère un code aléatoire de 8 caractères (lettres et chiffres)
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
      const existingEleve = await this.findByCodeSecret(code);
      if (!existingEleve) {
        isUnique = true;
      }
    }
    return code;
  }

  // Mettre à jour un élève
  static async update(id, { nom, prenom, classe_id }) {
    await db.execute(
      'UPDATE eleves SET nom = ?, prenom = ?, classe_id = ? WHERE id = ?',
      [nom.trim(), prenom.trim(), classe_id, id]
    );
    return true;
  }

  // Créer un nouvel élève
  static async create(nom, prenom, classe_id) {
    // Générer un code secret unique
    const code_secret = await this.generateUniqueCodeSecret();
    
    const [result] = await db.execute(
      'INSERT INTO eleves (nom, prenom, classe_id, code_secret) VALUES (?, ?, ?, ?)',
      [nom, prenom, classe_id, code_secret]
    );
    
    return {
      id: result.insertId,
      code_secret
    };
  }
}

module.exports = Eleve;
