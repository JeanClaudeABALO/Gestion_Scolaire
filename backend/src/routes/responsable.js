const express = require('express');
const router = express.Router();
const multer = require('multer');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const {
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
} = require('../controllers/responsableController');
const { uploadEleves } = require('../controllers/uploadController');
const upload = require('../middleware/upload');

// Toutes les routes nécessitent une authentification et des droits admin
router.use((req, res, next) => {
  console.log('📋 Route responsable:', req.method, req.path);
  next();
});
router.use(authenticateToken);
router.use(isAdmin);

router.get('/professeurs', getAllProfesseurs);
router.get('/eleves', getAllEleves);
router.post('/eleves', createEleve);
router.put('/eleves/:id', updateEleve);
router.get('/classes', getAllClasses);
router.get('/filieres', getAllFilieres);
router.get('/matieres', getAllMatieres);
router.get('/notes', getAllNotes);
router.post('/professeurs/:id/reset-code', resetProfesseurCode);
router.put('/professeurs/:id', updateProfesseur);
router.post('/matieres', createMatiere);
router.get('/eleves/:eleve_id/notes-organisees', getEleveNotesOrganisees);

// Route pour upload des élèves avec gestion d'erreurs multer
// Important : cette route doit être avant les autres middlewares qui parsent le body
router.post('/upload-eleves', (req, res, next) => {
  console.log('Requête upload reçue:', {
    method: req.method,
    headers: req.headers['content-type'],
    hasFile: !!req.file
  });
  
  upload.single('file')(req, res, (err) => {
    if (err) {
      console.error('Erreur multer:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: 'Le fichier est trop volumineux. Taille maximale : 10 MB' });
        }
        return res.status(400).json({ message: `Erreur upload: ${err.message}` });
      }
      return res.status(400).json({ message: err.message || 'Erreur lors du téléversement du fichier' });
    }
    console.log('Fichier uploadé avec succès:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'Aucun fichier');
    next();
  });
}, uploadEleves);

module.exports = router;
