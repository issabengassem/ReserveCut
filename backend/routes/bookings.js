const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const authenticateToken = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/available-slots', bookingController.getAvailableSlots);
router.get('/my-bookings', authenticateToken, bookingController.getMyBookings);
router.get('/salon/:salonId', authenticateToken, roleCheck('salon'), bookingController.getSalonBookings);
router.post('/', authenticateToken, bookingController.createBooking);
router.put('/:id/status', authenticateToken, roleCheck('salon'), bookingController.updateBookingStatus);
router.delete('/:id', authenticateToken, bookingController.cancelBooking);

module.exports = router;
