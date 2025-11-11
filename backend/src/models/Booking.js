import { query } from '../config/database.js';

export const Booking = {
  // Crear nueva reserva (SIN tabla customers)
  async create(bookingData) {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      barberId,
      bookingDate,
      bookingTime,
      customerNotes = ''
    } = bookingData;

    try {
      // Obtener información del servicio y barbero para guardarla en la reserva
      const serviceResult = await query('SELECT name, price FROM services WHERE id = $1', [serviceId]);
      const barberResult = await query('SELECT name FROM barbers WHERE id = $1', [barberId]);
      
      const service = serviceResult.rows[0];
      const barber = barberResult.rows[0];

      if (!service || !barber) {
        throw new Error('Servicio o barbero no encontrado');
      }

      // Crear reserva directamente (SIN customers)
      const bookingResult = await query(
        `INSERT INTO bookings (
          customer_name, customer_email, customer_phone, 
          service_id, barber_id, booking_date, booking_time, 
          customer_notes, status, service_price, service_name, barber_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9, $10, $11) 
        RETURNING *`,
        [
          customerName, customerEmail, customerPhone,
          serviceId, barberId, bookingDate, bookingTime,
          customerNotes, service.price, service.name, barber.name
        ]
      );

      return bookingResult.rows[0];

    } catch (error) {
      throw error;
    }
  },

  // Obtener todas las reservas (SIN JOIN con customers)
  async findAll(filters = {}) {
    let sql = `
      SELECT 
        id,
        customer_name,
        customer_email,
        customer_phone,
        service_id,
        barber_id,
        booking_date,
        booking_time,
        status,
        customer_notes,
        service_price,
        service_name,
        barber_name,
        created_at,
        updated_at
      FROM bookings
    `;

    const values = [];
    const conditions = [];

    if (filters.date) {
      conditions.push(`booking_date = $${values.length + 1}`);
      values.push(filters.date);
    }

    if (filters.status) {
      conditions.push(`status = $${values.length + 1}`);
      values.push(filters.status);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY booking_date DESC, booking_time DESC`;

    const result = await query(sql, values);
    return result.rows;
  },

  // Actualizar estado de reserva
  async updateStatus(id, status) {
    const result = await query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Eliminar reserva
  async delete(id) {
    const result = await query('DELETE FROM bookings WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};