import express from 'express';
import { bookingController } from '../controllers/bookingController.js';

const router = express.Router();

// GET /api/bookings - Obtener todas las reservas
router.get('/', bookingController.getBookings);

// POST /api/bookings - Crear nueva reserva
router.post('/', bookingController.createBooking);

// PUT /api/bookings/:id/status - Actualizar estado de reserva
router.put('/:id/status', bookingController.updateBookingStatus);

// DELETE /api/bookings/:id - Eliminar reserva
router.delete('/:id', bookingController.deleteBooking);

export default router;
