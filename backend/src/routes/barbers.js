import express from 'express';
import { barberController } from '../controllers/barberController.js';

const router = express.Router();

// GET /api/barbers - Obtener todos los barberos
router.get('/', barberController.getBarbers);

export default router;