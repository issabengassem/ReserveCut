const pool = require('../config/database');

class Service {
  static async findBySalonId(salonId) {
    const [rows] = await pool.execute(
      'SELECT * FROM services WHERE salon_id = ? AND is_active = 1 ORDER BY name',
      [salonId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM services WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async create(serviceData) {
    const { salon_id, name, description, duration, price } = serviceData;
    const [result] = await pool.execute(
      'INSERT INTO services (salon_id, name, description, duration, price) VALUES (?, ?, ?, ?, ?)',
      [salon_id, name, description, duration, price]
    );
    return this.findById(result.insertId);
  }

  static async update(id, serviceData) {
    const { name, description, duration, price, is_active } = serviceData;
    const updates = [];
    const values = [];

    if (name) { updates.push('name = ?'); values.push(name); }
    if (description) { updates.push('description = ?'); values.push(description); }
    if (duration) { updates.push('duration = ?'); values.push(duration); }
    if (price) { updates.push('price = ?'); values.push(price); }
    if (is_active !== undefined) { updates.push('is_active = ?'); values.push(is_active); }

    values.push(id);
    await pool.execute(
      `UPDATE services SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.execute('DELETE FROM services WHERE id = ?', [id]);
  }
}

module.exports = Service;
