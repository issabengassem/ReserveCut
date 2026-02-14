const pool = require('../config/database');

class Salon {
  // دالة findAll و findById غايبقاو كيفما هما حيت s.* كافية 
  // باش تجبد image_url إلا كان كاين في الـ Database.
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

  // --- التعديل هنا في دالة create ---
  static async create(salonData) {
    try {
      // زدنا image_url هنا
      const { owner_id, name, address, city, phone, email, description, opening_hours, image, image_url } = salonData;
      const [result] = await pool.execute(
        'INSERT INTO salons (owner_id, name, address, city, phone, email, description, opening_hours, image, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [owner_id, name, address, city, phone, email, description, opening_hours, image, image_url]
      );
      return this.findById(result.insertId);
    } catch (error) {
      console.error("💥 Error in Salon.create:", error);
      throw error;
    }
  }

  // --- التعديل هنا في دالة update ---
  static async update(id, salonData) {
    const { name, address, city, phone, email, description, opening_hours, is_active, image, image_url } = salonData;
    const updates = [];
    const values = [];

    if (name) updates.push('name = ?'), values.push(name);
    if (address) updates.push('address = ?'), values.push(address);
    if (city) updates.push('city = ?'), values.push(city);
    if (phone) updates.push('phone = ?'), values.push(phone);
    if (email) updates.push('email = ?'), values.push(email);
    if (description) updates.push('description = ?'), values.push(description);
    if (opening_hours) updates.push('opening_hours = ?'), values.push(opening_hours);
    if (image) updates.push('image = ?'), values.push(image);
    // زدنا image_url هنا باش تقدر تزيد رابط من بعد
    if (image_url) updates.push('image_url = ?'), values.push(image_url);
    if (is_active !== undefined) updates.push('is_active = ?'), values.push(is_active);

    values.push(id);

    await pool.execute(
      `UPDATE salons SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }
}

module.exports = Salon;