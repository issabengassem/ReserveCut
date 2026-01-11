const pool = require('../config/database');

class Booking {
  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      `SELECT b.*, s.name as salon_name, s.address as salon_address, 
       srv.name as service_name, srv.duration, srv.price
       FROM bookings b
       JOIN salons s ON b.salon_id = s.id
       JOIN services srv ON b.service_id = srv.id
       WHERE b.user_id = ?
       ORDER BY b.appointment_date DESC, b.appointment_time DESC`,
      [userId]
    );
    return rows;
  }

  static async findBySalonId(salonId) {
    const [rows] = await pool.execute(
      `SELECT b.*, u.name as user_name, u.phone as user_phone,
       srv.name as service_name, srv.duration, srv.price
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services srv ON b.service_id = srv.id
       WHERE b.salon_id = ?
       ORDER BY b.appointment_date DESC, b.appointment_time DESC`,
      [salonId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT b.*, u.name as user_name, u.phone as user_phone,
       s.name as salon_name, srv.name as service_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN salons s ON b.salon_id = s.id
       JOIN services srv ON b.service_id = srv.id
       WHERE b.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findAvailableSlots(salonId, serviceId, date) {
    // Récupérer les créneaux déjà réservés pour ce jour
    const [bookings] = await pool.execute(
      'SELECT appointment_time FROM bookings WHERE salon_id = ? AND service_id = ? AND appointment_date = ? AND status != "cancelled"',
      [salonId, serviceId, date]
    );

    // Récupérer les heures d'ouverture du salon
    const salon = await pool.execute(
      'SELECT opening_hours FROM salons WHERE id = ?',
      [salonId]
    );

    // Récupérer la durée du service
    const [service] = await pool.execute(
      'SELECT duration FROM services WHERE id = ?',
      [serviceId]
    );

    const bookedTimes = bookings.map(b => b.appointment_time);
    // TODO: Générer les créneaux disponibles basés sur les heures d'ouverture
    // Cette logique devrait être plus complexe dans un vrai projet

    return {
      available: true,
      bookedSlots: bookedTimes
    };
  }

  static async create(bookingData) {
    const { user_id, salon_id, service_id, appointment_date, appointment_time, notes } = bookingData;
    const [result] = await pool.execute(
      'INSERT INTO bookings (user_id, salon_id, service_id, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, "pending")',
      [user_id, salon_id, service_id, appointment_date, appointment_time, notes]
    );
    return this.findById(result.insertId);
  }

  static async updateStatus(id, status) {
    await pool.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, id]
    );
    return this.findById(id);
  }

  static async cancel(id) {
    return this.updateStatus(id, 'cancelled');
  }
}

module.exports = Booking;
