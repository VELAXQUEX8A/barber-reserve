import { Booking } from '../models/Booking.js';

export const bookingController = {
  // Obtener todas las reservas
  async getBookings(req, res) {
    try {
      console.log('📋 Obteniendo reservas desde la base de datos...');
      const { date, status } = req.query;
      const bookings = await Booking.findAll({ date, status });
      
      console.log(`✅ Reservas encontradas: ${bookings.length}`);
      
      res.json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error) {
      console.error('❌ Error en bookingController:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservas: ' + error.message
      });
    }
  },

  // Crear nueva reserva
  async createBooking(req, res) {
    try {
      console.log('➕ Creando nueva reserva...');
      const booking = await Booking.create(req.body);
      
      res.status(201).json({
        success: true,
        data: booking,
        message: 'Reserva creada exitosamente'
      });
    } catch (error) {
      console.error('❌ Error creando reserva:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear reserva: ' + error.message
      });
    }
  },

  // Actualizar estado de reserva
  async updateBookingStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Estado inválido'
        });
      }

      const booking = await Booking.updateStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Reserva no encontrada'
        });
      }

      res.json({
        success: true,
        data: booking,
        message: `Reserva ${status}`
      });
    } catch (error) {
      console.error('❌ Error actualizando reserva:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar reserva: ' + error.message
      });
    }
  },

  // Eliminar reserva
  async deleteBooking(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.delete(id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Reserva no encontrada'
        });
      }

      res.json({
        success: true,
        message: 'Reserva eliminada exitosamente'
      });
    } catch (error) {
      console.error('❌ Error eliminando reserva:', error);
      res.status(500).json({
        success: false,
        error: 'Error al eliminar reserva: ' + error.message
      });
    }
  }
};
