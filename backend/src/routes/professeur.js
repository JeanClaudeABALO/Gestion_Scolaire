const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getMesClasses,
  getMesMatieres,
  getElevesByClasse,
  getElevesWithNotes,
  getNotesByMatiere,
  createNote,
  updateNote
} = require('../controllers/professeurController');

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

router.get('/classes', getMesClasses);
router.get('/matieres', getMesMatieres);
router.get('/classes/:classe_id/eleves', getElevesByClasse);
router.get('/classes/:classe_id/matieres/:matiere_id/trimestre/:trimestre/eleves-notes', getElevesWithNotes);
router.get('/matieres/:matiere_id/notes', getNotesByMatiere);
router.post('/notes', createNote);
router.put('/notes/:id', updateNote);

module.exports = router;
