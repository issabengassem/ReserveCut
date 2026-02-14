const multer = require('multer');

// Memory storage (we want the buffer to insert into MySQL)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seuls les fichiers images sont autorisés'));
    }
    cb(null, true);
  }
});

module.exports = upload;
