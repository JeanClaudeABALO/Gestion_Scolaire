const express = require('express');
const router = express.Router();
const { loginProfesseur, loginParent } = require('../controllers/authController');
const { checkAdminExists, inscription } = require('../controllers/inscriptionController');
const Matiere = require('../models/Matiere');

// Routes publiques
router.get('/check-admin', checkAdminExists);
router.get('/matieres', async (req, res) => {
  try {
    const matieres = await Matiere.findAll();
    res.json(matieres);
  } catch (error) {
    console.error('Erreur getMatieres (inscription):', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.post('/inscription', inscription);

// Routes de connexion
router.post('/professeur', loginProfesseur);
router.post('/parent', loginParent);

module.exports = router;
