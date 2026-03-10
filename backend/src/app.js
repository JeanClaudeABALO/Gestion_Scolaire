const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS : en production, autoriser l'origine du frontend (ex. http://localhost pour Docker)
const corsOrigin = process.env.CORS_ORIGIN || true;
app.use(cors({ origin: corsOrigin }));

// Middleware pour parser le body JSON (sauf pour les routes d'upload)
app.use((req, res, next) => {
  // Ne pas parser le body pour les routes d'upload (multer le fera)
  if (req.path.includes('/upload-eleves')) {
    return next();
  }
  express.json({ limit: '10mb' })(req, res, next);
});

app.use((req, res, next) => {
  if (req.path.includes('/upload-eleves')) {
    return next();
  }
  express.urlencoded({ extended: true, limit: '10mb' })(req, res, next);
});

// Routes
const authRoutes = require('./routes/auth');
const professeurRoutes = require('./routes/professeur');
const responsableRoutes = require('./routes/responsable');
const parentRoutes = require('./routes/parent');
const classesRoutes = require('./routes/classes');
const matieresRoutes = require('./routes/matieres');
const notesRoutes = require('./routes/notes');

app.use('/api/auth', authRoutes);
app.use('/api/professeur', professeurRoutes);
app.use('/api/responsable', responsableRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/matieres', matieresRoutes);
app.use('/api/notes', notesRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API fonctionnelle' });
});

// En production : servir le frontend (dossier public = build Vue copié ici par build-for-deploy.sh)
const fs = require('fs');
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur', error: err.message });
});

app.listen(PORT, () => {
  console.log(` Serveur démarré sur le port ${PORT}`);
});
