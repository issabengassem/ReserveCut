const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/salon/:salonId', serviceController.getServicesBySalon);
router.post('/salon/:salonId', authenticateToken, roleCheck('salon'), serviceController.createService);
router.put('/:id', authenticateToken, roleCheck('salon'), serviceController.updateService);
router.delete('/:id', authenticateToken, roleCheck('salon'), serviceController.deleteService);

module.exports = router;
