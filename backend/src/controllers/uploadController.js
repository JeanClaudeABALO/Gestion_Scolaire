const xlsx = require('xlsx');
const mammoth = require('mammoth');
const db = require('../config/database');
const crypto = require('crypto');

// Générer un code secret aléatoire unique
const generateCodeSecret = async () => {
  let codeSecret;
  let exists = true;
  
  while (exists) {
    // Générer un code de 8 caractères alphanumériques
    codeSecret = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Vérifier si le code existe déjà
    const [rows] = await db.execute(
      'SELECT id FROM eleves WHERE code_secret = ?',
      [codeSecret]
    );
    
    exists = rows.length > 0;
  }
  
  return codeSecret;
};

// Parser un fichier Excel
const parseExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { 
    type: 'buffer',
    cellDates: false,
    cellNF: false,
    cellText: false
  });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convertir en JSON avec header: 1 pour avoir un tableau de tableaux
  const rawData = xlsx.utils.sheet_to_json(worksheet, { 
    defval: '', 
    raw: false,
    header: 1 // Retourne un tableau de tableaux au lieu d'objets
  });
  
  console.log('Données brutes Excel (premières 3 lignes):', JSON.stringify(rawData.slice(0, 3), null, 2));
  
  if (rawData.length < 2) {
    console.log('Fichier vide ou pas assez de lignes');
    return [];
  }
  
  // La première ligne contient les en-têtes
  const headers = rawData[0].map(h => String(h || '').trim());
  console.log('En-têtes détectés:', headers);
  
  // Fonction pour normaliser les chaînes (enlever accents, espaces, casse)
  const normalize = (str) => {
    return String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
      .replace(/\s+/g, '') // Enlever les espaces
      .toLowerCase();
  };
  
  // Trouver les indices des colonnes
  const findHeaderIndex = (variations) => {
    for (const variation of variations) {
      const normalizedVariation = normalize(variation);
      const index = headers.findIndex(h => {
        const normalizedHeader = normalize(h);
        return normalizedHeader === normalizedVariation;
      });
      if (index !== -1) return index;
    }
    return -1;
  };
  
  const nomIndex = findHeaderIndex(['Nom', 'nom', 'NOM', 'Name', 'NAME', 'NOM_', 'NOMBRE']);
  const prenomIndex = findHeaderIndex(['Prénom', 'prenom', 'PRENOM', 'Prenom', 'Prénom', 'PRÉNOM', 'First Name', 'FirstName', 'FIRSTNAME', 'prenom', 'PRENOM']);
  const classeIndex = findHeaderIndex(['Classe', 'classe', 'CLASSE', 'Class', 'CLASS', 'CLASSE_']);
  const filiereIndex = findHeaderIndex(['Filière', 'filiere', 'FILIERE', 'Filiere', 'Filière', 'FILIÈRE', 'Field', 'FIELD', 'filiere']);
  
  console.log('Indices des colonnes:', { nomIndex, prenomIndex, classeIndex, filiereIndex });
  
  if (nomIndex === -1 || prenomIndex === -1 || classeIndex === -1 || filiereIndex === -1) {
    console.error('Colonnes manquantes dans le fichier. En-têtes trouvés:', headers);
    throw new Error(`Colonnes requises non trouvées. En-têtes détectés: ${headers.join(', ')}. Attendu: Nom, Prénom, Classe, Filière`);
  }
  
  // Convertir les lignes de données en objets
  const data = [];
  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length === 0) continue; // Ignorer les lignes vides
    
    const nom = String(row[nomIndex] || '').trim();
    const prenom = String(row[prenomIndex] || '').trim();
    const classe = String(row[classeIndex] || '').trim();
    const filiere = String(row[filiereIndex] || '').trim();
    
    console.log(`Ligne ${i + 1}: nom="${nom}", prenom="${prenom}", classe="${classe}", filiere="${filiere}"`);
    
    data.push({
      nom: nom,
      prenom: prenom,
      classe: classe,
      filiere: filiere
    });
  }
  
  return data;
};

// Parser un fichier Word (convertir en texte puis parser)
const parseWord = async (buffer) => {
  const result = await mammoth.extractRawText({ buffer });
  const lines = result.value.split('\n').filter(line => line.trim());
  
  const eleves = [];
  for (const line of lines) {
    // Format attendu : Nom, Prénom, Classe, Filière
    const parts = line.split(',').map(p => p.trim());
    if (parts.length >= 4) {
      eleves.push({
        nom: parts[0],
        prenom: parts[1],
        classe: parts[2],
        filiere: parts[3]
      });
    }
  }
  
  return eleves;
};

// Upload et traitement du fichier
const uploadEleves = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni. Veuillez sélectionner un fichier Excel ou Word.' });
    }

    console.log('Fichier reçu:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    const file = req.file;
    let elevesData = [];

    // Parser selon le type de fichier
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      // Fichier Excel
      try {
        elevesData = parseExcel(file.buffer);
      } catch (error) {
        console.error('Erreur lors du parsing Excel:', error);
        return res.status(400).json({ 
          message: error.message || 'Erreur lors de la lecture du fichier Excel. Vérifiez que le fichier contient les colonnes: Nom, Prénom, Classe, Filière' 
        });
      }
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
               file.originalname.endsWith('.docx')) {
      // Fichier Word
      elevesData = await parseWord(file.buffer);
    } else {
      return res.status(400).json({ 
        message: 'Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou Word (.docx)' 
      });
    }

    if (elevesData.length === 0) {
      return res.status(400).json({ message: 'Aucune donnée trouvée dans le fichier' });
    }

    // Valider et insérer les élèves
    const resultats = [];
    const erreurs = [];

    console.log(`Nombre d'élèves à traiter: ${elevesData.length}`);
    if (elevesData.length > 0) {
      console.log('Premier élève exemple:', JSON.stringify(elevesData[0], null, 2));
    }

    for (let i = 0; i < elevesData.length; i++) {
      const eleveData = elevesData[i];
      const ligneNum = i + 2; // +2 car la première ligne est l'en-tête (ligne 1) et on commence à 0
      
      // Validation avec messages plus détaillés
      const champsManquants = [];
      if (!eleveData.nom || eleveData.nom.trim() === '') champsManquants.push('Nom');
      if (!eleveData.prenom || eleveData.prenom.trim() === '') champsManquants.push('Prénom');
      if (!eleveData.classe || eleveData.classe.trim() === '') champsManquants.push('Classe');
      if (!eleveData.filiere || eleveData.filiere.trim() === '') champsManquants.push('Filière');
      
      if (champsManquants.length > 0) {
        erreurs.push({
          ligne: ligneNum,
          raison: `Données incomplètes: ${champsManquants.join(', ')} manquant(s)`,
          donnees: eleveData
        });
        continue;
      }

      try {
        // Trouver ou créer la filière
        let [filiereRows] = await db.execute(
          'SELECT id FROM filieres WHERE nom = ?',
          [eleveData.filiere]
        );

        let filiereId;
        if (filiereRows.length === 0) {
          const [insertFiliere] = await db.execute(
            'INSERT INTO filieres (nom) VALUES (?)',
            [eleveData.filiere]
          );
          filiereId = insertFiliere.insertId;
        } else {
          filiereId = filiereRows[0].id;
        }

        // Trouver ou créer la classe
        let [classeRows] = await db.execute(
          'SELECT id FROM classes WHERE nom = ? AND filiere_id = ?',
          [eleveData.classe, filiereId]
        );

        let classeId;
        if (classeRows.length === 0) {
          const [insertClasse] = await db.execute(
            'INSERT INTO classes (nom, filiere_id) VALUES (?, ?)',
            [eleveData.classe, filiereId]
          );
          classeId = insertClasse.insertId;
        } else {
          classeId = classeRows[0].id;
        }

        // Vérifier si l'élève existe déjà
        const [existingEleve] = await db.execute(
          'SELECT id FROM eleves WHERE nom = ? AND prenom = ? AND classe_id = ?',
          [eleveData.nom, eleveData.prenom, classeId]
        );

        if (existingEleve.length > 0) {
          erreurs.push({
            ligne: elevesData.indexOf(eleveData) + 1,
            raison: 'Élève déjà existant',
            donnees: eleveData
          });
          continue;
        }

        // Générer le code secret
        const codeSecret = await generateCodeSecret();

        // Insérer l'élève
        await db.execute(
          'INSERT INTO eleves (nom, prenom, classe_id, code_secret) VALUES (?, ?, ?, ?)',
          [eleveData.nom, eleveData.prenom, classeId, codeSecret]
        );

        resultats.push({
          nom: eleveData.nom,
          prenom: eleveData.prenom,
          classe: eleveData.classe,
          filiere: eleveData.filiere,
          code_secret: codeSecret
        });
      } catch (error) {
        erreurs.push({
          ligne: elevesData.indexOf(eleveData) + 1,
          raison: error.message,
          donnees: eleveData
        });
      }
    }

    res.json({
      message: `${resultats.length} élève(s) créé(s) avec succès`,
      succes: resultats,
      erreurs: erreurs,
      total: elevesData.length,
      reussi: resultats.length,
      echec: erreurs.length
    });
    } catch (error) {
      console.error('Erreur upload élèves:', error);
      res.status(500).json({ 
        message: 'Erreur lors du traitement du fichier', 
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  };

module.exports = {
  uploadEleves
};
