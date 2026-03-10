const jwt = require('jsonwebtoken');
const Professeur = require('../models/Professeur');

// Middleware pour vérifier le token JWT
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      console.log('Token manquant pour:', req.method, req.path);
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', { id: decoded.id, role: decoded.role });
    
    const professeur = await Professeur.findById(decoded.id);

    if (!professeur) {
      console.log(' Professeur non trouvé avec id:', decoded.id);
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    console.log(' Professeur trouvé:', { id: professeur.id, nom: professeur.nom, role: professeur.role });
    req.user = professeur;
    next();
  } catch (error) {
    console.error(' Erreur authentification token:', error.message);
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  console.log(' Vérification admin pour:', req.method, req.path);
  console.log(' User:', req.user ? { id: req.user.id, nom: req.user.nom, role: req.user.role } : 'null');
  
  if (req.user && req.user.role === 'ADMIN') {
    console.log('Accès admin autorisé');
    next();
  } else {
    console.log('Accès refusé - Rôle:', req.user?.role || 'non défini');
    return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
};

module.exports = {
  authenticateToken,
  isAdmin
};
