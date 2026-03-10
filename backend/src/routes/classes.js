const express = require('express');
const router = express.Router();
const Classe = require('../models/Classe');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const classes = await Classe.findAll();
    res.json(classes);
  } catch (error) {
    console.error('Erreur getClasses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
