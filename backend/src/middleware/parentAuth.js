const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token parent (élève)
const authenticateParent = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.type !== 'PARENT' || !decoded.eleve_id) {
      return res.status(401).json({ message: 'Token invalide pour parent' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

module.exports = {
  authenticateParent
};
