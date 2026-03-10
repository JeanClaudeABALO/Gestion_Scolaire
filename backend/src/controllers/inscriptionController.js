const Professeur = require('../models/Professeur');
const Matiere = require('../models/Matiere');
const db = require('../config/database');

// Vérifier si un administrateur existe déjà
const checkAdminExists = async (req, res) => {
  try {
    const count = await Professeur.countAdmins();
    res.json({ exists: count > 0 });
  } catch (error) {
    console.error('Erreur checkAdminExists:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Inscription d'un professeur
const inscription = async (req, res) => {
  try {
    const { nom, prenom, matieres, role } = req.body;

    // Validation des champs requis (nom, prénom, rôle)
    if (!nom || !prenom) {
      return res.status(400).json({ 
        message: 'Le nom et le prénom sont requis' 
      });
    }

    if (!role || !['PROF', 'ADMIN'].includes(role)) {
      return res.status(400).json({ 
        message: 'Le rôle doit être PROF ou ADMIN' 
      });
    }

    // Vérifier qu'un seul admin peut exister
    if (role === 'ADMIN') {
      const adminCount = await Professeur.countAdmins();
      if (adminCount > 0) {
        return res.status(403).json({ 
          message: 'Un administrateur existe déjà. Vous ne pouvez pas créer un second compte administrateur.' 
        });
      }
    }

    // Générer un code unique
    const code_professeur = await Professeur.generateUniqueCode();

    // Créer le professeur
    const professeurId = await Professeur.create({
      nom: nom.trim(),
      prenom: prenom.trim(),
      code_professeur,
      role
    });

    // Associer les matières au professeur si des matières ont été sélectionnées
    if (matieres && Array.isArray(matieres) && matieres.length > 0) {
      const matieresIds = matieres.map(m => parseInt(m)).filter(id => !isNaN(id));
      
      if (matieresIds.length > 0) {
        // Vérifier que les matières existent
        const placeholders = matieresIds.map(() => '?').join(',');
        const [matieresRows] = await db.execute(
          `SELECT id FROM matieres WHERE id IN (${placeholders})`,
          matieresIds
        );

        if (matieresRows.length !== matieresIds.length) {
          // Si certaines matières sont invalides, on continue quand même l'inscription
          // mais on n'associe que les matières valides
          const validIds = matieresRows.map(row => row.id);
          for (const matiereId of validIds) {
            await db.execute(
              'UPDATE matieres SET professeur_id = ? WHERE id = ?',
              [professeurId, matiereId]
            );
          }
        } else {
          // Toutes les matières sont valides, on les associe toutes
          for (const matiereId of matieresIds) {
            await db.execute(
              'UPDATE matieres SET professeur_id = ? WHERE id = ?',
              [professeurId, matiereId]
            );
          }
        }
      }
    }

    res.status(201).json({
      message: 'Inscription réussie',
      code_professeur,
      professeur: {
        id: professeurId,
        nom,
        prenom,
        role
      }
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
};

module.exports = {
  checkAdminExists,
  inscription
};
