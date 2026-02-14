const express = require('express');
const router = express.Router();
const salonController = require('../controllers/salonController');
const authenticateToken = require('../middleware/auth'); // your existing auth
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware'); // Multer middleware for image

// --- Public routes ---
router.get('/', salonController.getAllSalons);
router.get('/:id', salonController.getSalonById);

// --- Authenticated routes ---
router.get('/my-salons', authenticateToken, roleCheck('salon'), salonController.getMySalons);

// --- Create & update salon with image upload ---
router.post(
  '/',
  // authenticateToken,
  // roleCheck('salon'),
  upload.single('image'),           // Multer handles the 'image' file
  salonController.createSalon
);

router.put(
  '/:id',
  // authenticateToken,
  // roleCheck('salon'),
  upload.single('image'),           // Multer handles the 'image' file
  salonController.updateSalon
);
module.exports = router;
