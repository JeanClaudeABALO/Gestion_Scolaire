const multer = require('multer');

// Configuration de multer pour stocker en mémoire
const storage = multer.memoryStorage();

// Filtre pour accepter uniquement Excel et Word
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  ];

  const allowedExtensions = ['.xlsx', '.xls', '.docx'];

  const isValidMime = allowedMimes.includes(file.mimetype);
  const isValidExtension = allowedExtensions.some(ext => 
    file.originalname.toLowerCase().endsWith(ext)
  );

  if (isValidMime || isValidExtension) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté. Utilisez Excel (.xlsx, .xls) ou Word (.docx)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB max
  }
});

module.exports = upload;
