const Eleve = require('../models/Eleve');
const Note = require('../models/Note');

// Obtenir les informations de l'élève
const getEleveInfo = async (req, res) => {
  try {
    const eleve_id = req.user.eleve_id;
    const eleve = await Eleve.findById(eleve_id);
    
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    res.json(eleve);
  } catch (error) {
    console.error('Erreur getEleveInfo:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les notes de l'élève (ancienne méthode - simple liste)
const getNotesEleve = async (req, res) => {
  try {
    const eleve_id = req.user.eleve_id;
    const notes = await Note.getNotesByEleve(eleve_id);
    res.json(notes);
  } catch (error) {
    console.error('Erreur getNotesEleve:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les notes organisées de l'élève (par matière et trimestre avec calculs)
const getNotesOrganisees = async (req, res) => {
  try {
    const eleve_id = req.user.eleve_id;
    const eleveDetails = await Eleve.getNotesOrganiseesByEleve(eleve_id);

    if (!eleveDetails) {
      return res.status(404).json({ message: 'Élève non trouvé ou aucune note.' });
    }

    res.json(eleveDetails);
  } catch (error) {
    console.error('Erreur getNotesOrganisees:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getEleveInfo,
  getNotesEleve,
  getNotesOrganisees
};
