const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join('../uploads');

// Crear el directorio "uploads" si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuracion sobre cómo Multer va a almacenar la información enviada
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir); // Uploads will be stored in the "files" directory
  },

  filename(req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Filtro para extension del archivo
const fileFilter = function (req, file, cb) {
  // acepta video y imagen
  if (
    file.mimetype === 'video/mp4'
    || file.mimetype === 'image/jpeg'
    || file.mimetype === 'image/png'
  ) {
    cb(null, true); // Acepta el archivo
  } else {
    cb(
      new Error(
        'El formato del archivo no es compatible. Solo se permiten archivos MP4, JPEG y PNG.',
      ),
      false,
    ); // Rechaza el archivo
  }
};

// Filtro para peso del archivo
const limits = {
  fileSize: 5 * 1024 * 1024, // Limita el tamaño del archivo a 5 MB
  files: 3,
};

// diferenciate between image and video
const upload = multer({
  storage,
  fileFilter,
  limits,
});

module.exports = upload;
