const db = require('../config/database');

class Eleve {
  static async findByCodeSecret(code_secret) {
    const [rows] = await db.execute(
      'SELECT * FROM eleves WHERE code_secret = ?',
      [code_secret]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
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
    const [rows] = await db.execute(
      `SELECT e.id, e.nom, e.prenom, e.code_secret, e.classe_id, c.nom as classe_nom
       FROM eleves e
       INNER JOIN classes c ON c.id = e.classe_id
       ORDER BY c.nom, e.nom, e.prenom`
    );
    return rows;
  }

  static async findByClasse(classe_id) {
    const [rows] = await db.execute(
      `SELECT e.id, e.nom, e.prenom, e.code_secret
       FROM eleves e
       WHERE e.classe_id = ?
       ORDER BY e.nom, e.prenom`,
      [classe_id]
    );
    return rows;
  }

  // Obtenir les élèves d'une classe avec leurs notes pour une matière spécifique
  static async findByClasseWithNotes(classe_id, matiere_id, trimestre) {
    const [rows] = await db.execute(
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
    return rows;
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

            // Calcul de la moyenne des interrogations
            const sumInterrogations = interrogations.reduce((sum, note) => sum + note, 0);
            const moyenneInterrogations = interrogations.length > 0
              ? (sumInterrogations / interrogations.length).toFixed(2)
              : null;

            // Moyenne générale
            const toutesNotes = [...interrogations, ...devoirs];
            const moyenne = toutesNotes.length > 0
              ? (toutesNotes.reduce((sum, note) => sum + note, 0) / toutesNotes.length).toFixed(2)
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
