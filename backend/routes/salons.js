const express = require('express');
const router = express.Router();
const salonController = require('../controllers/salonController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', salonController.getAllSalons);
router.get('/my-salons', authenticateToken, roleCheck('salon'), salonController.getMySalons);
router.get('/:id', salonController.getSalonById);
router.post('/', authenticateToken, roleCheck('salon'), salonController.createSalon);
router.put('/:id', authenticateToken, roleCheck('salon'), salonController.updateSalon);

module.exports = router;
