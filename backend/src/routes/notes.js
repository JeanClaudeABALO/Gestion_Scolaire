const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    console.error('Erreur getNotes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
