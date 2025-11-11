import { query } from '../config/database.js';

export const Barber = {
  // Obtener todos los barberos (sin is_active)
  async findAll() {
    const result = await query(
      'SELECT * FROM barbers ORDER BY name'
    );
    return result.rows;
  },

  // Obtener barbero por ID
  async findById(id) {
    const result = await query(
      'SELECT * FROM barbers WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
};