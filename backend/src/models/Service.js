import { query } from '../config/database.js';

export const Service = {
  // Obtener todos los servicios (sin is_active)
  async findAll() {
    const result = await query(
      'SELECT * FROM services ORDER BY name'
    );
    return result.rows;
  },

  // Obtener servicio por ID
  async findById(id) {
    const result = await query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
};