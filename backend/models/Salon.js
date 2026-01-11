const pool = require('../config/database');

class Salon {
  static async findAll() {
    const [rows] = await pool.execute(
      `SELECT s.*, 
       (SELECT AVG(rating) FROM reviews WHERE salon_id = s.id) as average_rating,
       (SELECT COUNT(*) FROM reviews WHERE salon_id = s.id) as review_count
       FROM salons s 
       WHERE s.is_active = 1 
       ORDER BY s.created_at DESC`
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT s.*, 
       (SELECT AVG(rating) FROM reviews WHERE salon_id = s.id) as average_rating,
       (SELECT COUNT(*) FROM reviews WHERE salon_id = s.id) as review_count
       FROM salons s 
       WHERE s.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findByOwnerId(ownerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM salons WHERE owner_id = ?',
      [ownerId]
    );
    return rows;
  }

  static async create(salonData) {
    const { owner_id, name, address, city, phone, email, description, opening_hours } = salonData;
    const [result] = await pool.execute(
      'INSERT INTO salons (owner_id, name, address, city, phone, email, description, opening_hours) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [owner_id, name, address, city, phone, email, description, JSON.stringify(opening_hours)]
    );
    return this.findById(result.insertId);
  }

  static async update(id, salonData) {
    const { name, address, city, phone, email, description, opening_hours, is_active } = salonData;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (address) { updates.push('address = ?'); values.push(address); }
    if (city) { updates.push('city = ?'); values.push(city); }
    if (phone) { updates.push('phone = ?'); values.push(phone); }
    if (email) { updates.push('email = ?'); values.push(email); }
    if (description) { updates.push('description = ?'); values.push(description); }
    if (opening_hours) { updates.push('opening_hours = ?'); values.push(JSON.stringify(opening_hours)); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

    values.push(id);
    await pool.execute(
      `UPDATE salons SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }
}

module.exports = Salon;
