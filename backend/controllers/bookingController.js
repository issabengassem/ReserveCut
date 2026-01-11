const Booking = require('../models/Booking');
const Notification = require('../models/Notification');

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findByUserId(req.user.id);

    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

exports.getSalonBookings = async (req, res) => {
  try {
    const { salonId } = req.params;
    const bookings = await Booking.findBySalonId(salonId);

    res.json({
      success: true,
      data: { bookings }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { salonId, serviceId, date } = req.query;

    if (!salonId || !serviceId || !date) {
      return res.status(400).json({
        success: false,
        message: 'salonId, serviceId et date sont requis'
      });
    }

    const slots = await Booking.findAvailableSlots(salonId, serviceId, date);

    res.json({
      success: true,
      data: { slots }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      user_id: req.user.id
    };

    // Vérifier la disponibilité
    const slots = await Booking.findAvailableSlots(
      bookingData.salon_id,
      bookingData.service_id,
      bookingData.appointment_date
    );

    if (slots.bookedSlots.includes(bookingData.appointment_time)) {
      return res.status(400).json({
        success: false,
        message: 'Ce créneau est déjà réservé'
      });
    }

    const booking = await Booking.create(bookingData);

    // Créer une notification pour le salon
    // TODO: Récupérer le owner_id du salon
    // await Notification.create({
    //   user_id: salonOwnerId,
    //   type: 'booking_new',
    //   title: 'Nouvelle réservation',
    //   message: `Une nouvelle réservation a été effectuée`,
    //   related_id: booking.id
    // });

    // Créer une notification pour le client
    await Notification.create({
      user_id: req.user.id,
      type: 'booking_confirmed',
      title: 'Réservation confirmée',
      message: `Votre réservation a été enregistrée pour le ${bookingData.appointment_date} à ${bookingData.appointment_time}`,
      related_id: booking.id
    });

    res.status(201).json({
      success: true,
      message: 'Réservation créée avec succès',
      data: { booking }
    });
  } catch (error) {
    console.error('Erreur lors de la création de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création'
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    const updatedBooking = await Booking.updateStatus(id, status);

    // Créer une notification pour le client
    const statusMessages = {
      confirmed: 'confirmée',
      cancelled: 'annulée',
      completed: 'complétée'
    };

    await Notification.create({
      user_id: booking.user_id,
      type: `booking_${status}`,
      title: `Réservation ${statusMessages[status] || status}`,
      message: `Votre réservation a été ${statusMessages[status] || status}`,
      related_id: id
    });

    res.json({
      success: true,
      message: `Réservation ${statusMessages[status] || status} avec succès`,
      data: { booking: updatedBooking }
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour'
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Réservation non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le propriétaire de la réservation
    if (booking.user_id !== req.user.id && req.user.role !== 'salon') {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'avez pas l\'autorisation d\'annuler cette réservation'
      });
    }

    const cancelledBooking = await Booking.cancel(id);

    res.json({
      success: true,
      message: 'Réservation annulée avec succès',
      data: { booking: cancelledBooking }
    });
  } catch (error) {
    console.error('Erreur lors de l\'annulation de la réservation:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'annulation'
    });
  }
};
