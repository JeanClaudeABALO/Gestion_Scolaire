const express = require('express');
const router = express.Router();
const Matiere = require('../models/Matiere');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const matieres = await Matiere.findAll();
    res.json(matieres);
  } catch (error) {
    console.error('Erreur getMatieres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
