const Professeur = require('../models/Professeur');
const Eleve = require('../models/Eleve');
const Classe = require('../models/Classe');
const Matiere = require('../models/Matiere');
const Note = require('../models/Note');

// Obtenir tous les professeurs
const getAllProfesseurs = async (req, res) => {
  try {
    const professeurs = await Professeur.findAll();
    res.json(professeurs);
  } catch (error) {
    console.error('Erreur getAllProfesseurs:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir tous les élèves
const getAllEleves = async (req, res) => {
  try {
    const eleves = await Eleve.findAll();
    res.json(eleves);
  } catch (error) {
    console.error('Erreur getAllEleves:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir toutes les classes
const getAllClasses = async (req, res) => {
  try {
    const classes = await Classe.findAll();
    res.json(classes);
  } catch (error) {
    console.error('Erreur getAllClasses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir toutes les matières
const getAllMatieres = async (req, res) => {
  try {
    const matieres = await Matiere.findAll();
    res.json(matieres);
  } catch (error) {
    console.error('Erreur getAllMatieres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir toutes les notes
const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.error('Erreur getAllNotes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Réinitialiser le code d'un professeur
const resetProfesseurCode = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier que le professeur existe
    const professeur = await Professeur.findById(id);
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // Générer un nouveau code unique
    const newCode = await Professeur.generateUniqueCode();
    
    // Mettre à jour le code
    await Professeur.updateCode(id, newCode);

    res.json({
      message: 'Code réinitialisé avec succès',
      code_professeur: newCode,
      professeur: {
        id: professeur.id,
        nom: professeur.nom,
        prenom: professeur.prenom
      }
    });
  } catch (error) {
    console.error('Erreur resetProfesseurCode:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour le nom/prénom d'un professeur
const updateProfesseur = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom } = req.body;

    if (!nom || !prenom) {
      return res.status(400).json({ message: 'Le nom et le prénom sont requis' });
    }

    const professeur = await Professeur.findById(id);
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    await Professeur.updateIdentity(id, nom.trim(), prenom.trim());

    res.json({
      message: 'Professeur mis à jour avec succès',
      professeur: {
        id,
        nom: nom.trim(),
        prenom: prenom.trim(),
        role: professeur.role
      }
    });
  } catch (error) {
    console.error('Erreur updateProfesseur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une nouvelle matière
const createMatiere = async (req, res) => {
  try {
    const { nom, classe_id, professeur_id } = req.body;

    // Validation
    if (!nom || !classe_id || !professeur_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier que la classe existe
    const classe = await Classe.findById(classe_id);
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    // Vérifier que le professeur existe
    const professeur = await Professeur.findById(professeur_id);
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // Créer la matière
    const matiereId = await Matiere.create(nom, classe_id, professeur_id);
    const matiere = await Matiere.findById(matiereId);

    res.status(201).json({
      message: 'Matière créée avec succès',
      matiere
    });
  } catch (error) {
    console.error('Erreur createMatiere:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir toutes les notes d'un élève organisées par matière
const getEleveNotesOrganisees = async (req, res) => {
  try {
    const { eleve_id } = req.params;
    const eleveDetails = await Eleve.getNotesOrganiseesByEleve(eleve_id);

    if (!eleveDetails) {
      return res.status(404).json({ message: 'Élève non trouvé ou aucune note.' });
    }

    res.json(eleveDetails);
  } catch (error) {
    console.error('Erreur getEleveNotesOrganisees:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir toutes les filières
const getAllFilieres = async (req, res) => {
  try {
    const db = require('../config/database');
    const [rows] = await db.execute('SELECT * FROM filieres ORDER BY nom');
    res.json(rows);
  } catch (error) {
    console.error('Erreur getAllFilieres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer un nouvel élève
const createEleve = async (req, res) => {
  try {
    const { nom, prenom, classe_id, sexe } = req.body;

    // Validation
    if (!nom || !prenom || !classe_id) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Vérifier que la classe existe
    const classe = await Classe.findById(classe_id);
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    // Créer l'élève (le code secret sera généré automatiquement)
    const result = await Eleve.create(nom, prenom, classe_id);
    if (sexe !== undefined) {
      await Eleve.setSexe(result.id, sexe);
    }
    const newEleve = await Eleve.findById(result.id);

    res.status(201).json({ 
      message: 'Élève créé avec succès', 
      eleve: newEleve,
      code_secret: result.code_secret
    });
  } catch (error) {
    console.error('Erreur createEleve:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier un élève
const updateEleve = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, classe_id, sexe } = req.body;

    if (!nom || !prenom || !classe_id) {
      return res.status(400).json({ message: 'Le nom, le prénom et la classe sont requis' });
    }

    const eleve = await Eleve.findById(id);
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    const classe = await Classe.findById(classe_id);
    if (!classe) {
      return res.status(404).json({ message: 'Classe non trouvée' });
    }

    await Eleve.update(id, { nom: nom.trim(), prenom: prenom.trim(), classe_id });
    if (sexe !== undefined) {
      await Eleve.setSexe(id, sexe);
    }
    const eleveUpdated = await Eleve.findById(id);

    res.json({
      message: 'Élève modifié avec succès',
      eleve: eleveUpdated
    });
  } catch (error) {
    console.error('Erreur updateEleve:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllProfesseurs,
  getAllEleves,
  getAllClasses,
  getAllMatieres,
  getAllNotes,
  resetProfesseurCode,
  createMatiere,
  getEleveNotesOrganisees,
  getAllFilieres,
  createEleve,
  updateEleve,
  updateProfesseur
};
