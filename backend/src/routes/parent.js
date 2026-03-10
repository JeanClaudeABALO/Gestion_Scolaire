const express = require('express');
const router = express.Router();
const { authenticateParent } = require('../middleware/parentAuth');
const { getEleveInfo, getNotesEleve, getNotesOrganisees } = require('../controllers/parentController');

// Toutes les routes nécessitent une authentification parent
router.use(authenticateParent);

router.get('/eleve', getEleveInfo);
router.get('/notes', getNotesEleve);
router.get('/notes-organisees', getNotesOrganisees);

module.exports = router;
