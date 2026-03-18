const Professeur = require('../models/Professeur');
const Classe = require('../models/Classe');
const Matiere = require('../models/Matiere');
const Eleve = require('../models/Eleve');
const Note = require('../models/Note');

// Obtenir les classes du professeur
const getMesClasses = async (req, res) => {
  try {
    const professeur_id = req.user.id;
    const classes = await Professeur.getClassesByProfesseur(professeur_id);
    res.json(classes);
  } catch (error) {
    console.error('Erreur getMesClasses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les matières du professeur
const getMesMatieres = async (req, res) => {
  try {
    const professeur_id = req.user.id;
    const matieres = await Professeur.getMatieresByProfesseur(professeur_id);
    res.json(matieres);
  } catch (error) {
    console.error('Erreur getMesMatieres:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les élèves d'une classe
const getElevesByClasse = async (req, res) => {
  try {
    const { classe_id } = req.params;
    const professeur_id = req.user.id;

    // Vérifier que le professeur enseigne dans cette classe
    const matieres = await Matiere.findByProfesseur(professeur_id);
    const classeAccessible = matieres.some(m => m.classe_id == classe_id);

    if (!classeAccessible) {
      return res.status(403).json({ message: 'Accès refusé à cette classe' });
    }

    const eleves = await Eleve.findByClasse(classe_id);
    res.json(eleves);
  } catch (error) {
    console.error('Erreur getElevesByClasse:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les notes d'une matière
const getNotesByMatiere = async (req, res) => {
  try {
    const { matiere_id } = req.params;
    const professeur_id = req.user.id;
    
    // Vérifier que le professeur enseigne cette matière
    const matiere = await Matiere.findById(matiere_id);
    if (!matiere || matiere.professeur_id != professeur_id) {
      return res.status(403).json({ message: 'Accès refusé à cette matière' });
    }

    const notes = await Note.findByMatiere(matiere_id);
    res.json(notes);
  } catch (error) {
    console.error('Erreur getNotesByMatiere:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les élèves d'une classe avec leurs notes organisées pour une matière
const getElevesWithNotes = async (req, res) => {
  try {
    const { classe_id, matiere_id, trimestre } = req.params;
    const professeur_id = req.user.id;

    // Vérifier que le professeur enseigne dans cette classe
    const matieres = await Matiere.findByProfesseur(professeur_id);
    const classeAccessible = matieres.some(m => m.classe_id == classe_id);
    
    if (!classeAccessible) {
      return res.status(403).json({ message: 'Accès refusé à cette classe' });
    }

    // Vérifier que la matière appartient au professeur
    const matiere = await Matiere.findById(matiere_id);
    if (!matiere || matiere.professeur_id != professeur_id || matiere.classe_id != classe_id) {
      return res.status(403).json({ message: 'Accès refusé à cette matière' });
    }

    // Obtenir les élèves de la classe
    const eleves = await Eleve.findByClasse(classe_id);
    
    // Pour chaque élève, obtenir ses notes pour cette matière et ce trimestre
    let elevesWithNotes = await Promise.all(
      eleves.map(async (eleve) => {
        const notes = await Note.findByEleveMatiereTrimestre(
          eleve.id, 
          parseInt(matiere_id), 
          parseInt(trimestre) || 1
        );

        // Organiser les notes par type (avec IDs pour édition)
        const notesInterro = notes
          .filter(n => n.type === 'Interrogation')
          .slice(0, 5);
        const notesDevoir = notes
          .filter(n => n.type === 'Devoir')
          .slice(0, 3);

        const interrogations = notesInterro.map(n => n.valeur);
        const interrogationIds = notesInterro.map(n => n.id);
        const devoirs = notesDevoir.map(n => n.valeur);
        const devoirIds = notesDevoir.map(n => n.id);

        // Moyenne des interrogations = somme(interros) / nb(interros)
        const moyenneInterrogations = interrogations.length > 0
          ? (interrogations.reduce((sum, note) => sum + parseFloat(note), 0) / interrogations.length).toFixed(2)
          : null;

        // Moyenne générale = (moyenneInterrogations + devoir1 + devoir2) / 3
        // (on suit la règle métier demandée; si une valeur manque, on ne calcule pas)
        const devoir1 = devoirs[0] !== undefined ? parseFloat(devoirs[0]) : null;
        const devoir2 = devoirs[1] !== undefined ? parseFloat(devoirs[1]) : null;
        const moyenne = (moyenneInterrogations !== null && devoir1 !== null && devoir2 !== null)
          ? ((parseFloat(moyenneInterrogations) + devoir1 + devoir2) / 3).toFixed(2)
          : null;

        // Coefficient (par défaut 1, peut être configuré plus tard)
        const coefficient = 1;
        const moyenneCoefficientee = moyenne ? (parseFloat(moyenne) * coefficient).toFixed(2) : null;

        return {
          id: eleve.id,
          code: eleve.code_secret,
          nom: eleve.nom,
          prenom: eleve.prenom,
          sexe: eleve.sexe || null,
          interrogations: [
            interrogations[0] ?? null,
            interrogations[1] ?? null,
            interrogations[2] ?? null,
            interrogations[3] ?? null,
            interrogations[4] ?? null
          ],
          interrogationIds: [
            interrogationIds[0] ?? null,
            interrogationIds[1] ?? null,
            interrogationIds[2] ?? null,
            interrogationIds[3] ?? null,
            interrogationIds[4] ?? null
          ],
          moyenneInterrogations: moyenneInterrogations,
          devoirs: [
            devoirs[0] ?? null,
            devoirs[1] ?? null,
            devoirs[2] ?? null
          ],
          devoirIds: [
            devoirIds[0] ?? null,
            devoirIds[1] ?? null,
            devoirIds[2] ?? null
          ],
          coefficient: coefficient,
          moyenne: moyenne,
          moyenneCoefficientee: moyenneCoefficientee
        };
      })
    );

    // Calcul du rang dans la matière (par moyenne décroissante)
    // Règle: rang dense (ex: 1,1,2,3...). Les moyennes null => rang null.
    const sortedForRank = [...elevesWithNotes]
      .map(e => ({ id: e.id, score: e.moyenne !== null ? parseFloat(e.moyenne) : null }))
      .sort((a, b) => {
        if (a.score === null && b.score === null) return 0;
        if (a.score === null) return 1;
        if (b.score === null) return -1;
        return b.score - a.score;
      });

    const rankById = new Map();
    let currentRank = 0;
    let lastScore = null;
    for (const item of sortedForRank) {
      if (item.score === null) {
        rankById.set(item.id, null);
        continue;
      }
      if (lastScore === null || item.score < lastScore) {
        currentRank += 1;
        lastScore = item.score;
      }
      rankById.set(item.id, currentRank);
    }

    elevesWithNotes = elevesWithNotes.map(e => ({
      ...e,
      rang: rankById.get(e.id) ?? null
    }));

    res.json(elevesWithNotes);
  } catch (error) {
    console.error('Erreur getElevesWithNotes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Créer une note
const createNote = async (req, res) => {
  try {
    const { eleve_id, matiere_id, valeur, type, trimestre } = req.body;
    const professeur_id = req.user.id;

    // Vérifier que le professeur enseigne cette matière
    const matiere = await Matiere.findById(matiere_id);
    if (!matiere || matiere.professeur_id != professeur_id) {
      return res.status(403).json({ message: 'Vous ne pouvez pas saisir de notes pour cette matière' });
    }

    // Vérifier que l'élève appartient à la classe de la matière
    const eleve = await Eleve.findById(eleve_id);
    if (!eleve || eleve.classe_id != matiere.classe_id) {
      return res.status(400).json({ message: 'L\'élève n\'appartient pas à cette classe' });
    }

    // Validation
    if (!eleve_id || !matiere_id || valeur === undefined || !type || !trimestre) {
      return res.status(400).json({ message: 'Tous les champs sont requis (eleve_id, matiere_id, valeur, type, trimestre)' });
    }

    if (valeur < 0 || valeur > 20) {
      return res.status(400).json({ message: 'La note doit être entre 0 et 20' });
    }

    if (![1, 2, 3].includes(parseInt(trimestre))) {
      return res.status(400).json({ message: 'Le trimestre doit être 1, 2 ou 3' });
    }

    if (!['Devoir', 'Interrogation', 'Examen'].includes(type)) {
      return res.status(400).json({ message: 'Le type doit être Devoir, Interrogation ou Examen' });
    }

    const noteId = await Note.create({ eleve_id, matiere_id, valeur, type, trimestre });
    const note = await Note.findById(noteId);

    res.status(201).json({ message: 'Note créée avec succès', note });
  } catch (error) {
    console.error('Erreur createNote:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier une note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { valeur, type, trimestre } = req.body;
    const professeur_id = req.user.id;

    // Vérifier que la note existe et appartient à une matière du professeur
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note non trouvée' });
    }

    // Vérifier via la matière (ou autoriser l'admin)
    const matiere = await Matiere.findById(note.matiere_id);
    const isAdmin = req.user.role === 'ADMIN';
    if (!isAdmin && (!matiere || matiere.professeur_id != professeur_id)) {
      return res.status(403).json({ message: 'Vous ne pouvez pas modifier cette note' });
    }

    // Validation
    if (valeur !== undefined && (valeur < 0 || valeur > 20)) {
      return res.status(400).json({ message: 'La note doit être entre 0 et 20' });
    }

    if (trimestre !== undefined && ![1, 2, 3].includes(parseInt(trimestre))) {
      return res.status(400).json({ message: 'Le trimestre doit être 1, 2 ou 3' });
    }

    await Note.update(id, { valeur, type, trimestre });
    const noteUpdated = await Note.findById(id);

    res.json({ message: 'Note modifiée avec succès', note: noteUpdated });
  } catch (error) {
    console.error('Erreur updateNote:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getMesClasses,
  getMesMatieres,
  getElevesByClasse,
  getElevesWithNotes,
  getNotesByMatiere,
  createNote,
  updateNote
};
