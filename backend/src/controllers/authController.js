const jwt = require('jsonwebtoken');
const Professeur = require('../models/Professeur');
const Eleve = require('../models/Eleve');

// Connexion professeur/responsable
const loginProfesseur = async (req, res) => {
  try {
    const { code_professeur } = req.body;

    if (!code_professeur) {
      return res.status(400).json({ message: 'Code professeur requis' });
    }

    const professeur = await Professeur.findByCode(code_professeur);

    if (!professeur) {
      return res.status(401).json({ message: 'Code professeur invalide' });
    }

    const token = jwt.sign(
      { id: professeur.id, role: professeur.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: professeur.id,
        nom: professeur.nom,
        prenom: professeur.prenom,
        role: professeur.role
      }
    });
  } catch (error) {
    console.error('Erreur login professeur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Connexion parent (via code secret élève)
const loginParent = async (req, res) => {
  try {
    const { code_secret } = req.body;

    if (!code_secret) {
      return res.status(400).json({ message: 'Code secret requis' });
    }

    const eleve = await Eleve.findByCodeSecret(code_secret);

    if (!eleve) {
      return res.status(401).json({ message: 'Code secret invalide' });
    }

    // Pour les parents, on peut créer un token simple ou utiliser une session
    const token = jwt.sign(
      { eleve_id: eleve.id, type: 'PARENT' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    const eleveComplet = await Eleve.findById(eleve.id);

    res.json({
      message: 'Connexion réussie',
      token,
      eleve: eleveComplet
    });
  } catch (error) {
    console.error('Erreur login parent:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  loginProfesseur,
  loginParent
};
