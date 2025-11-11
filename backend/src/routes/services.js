import express from 'express';
import { serviceController } from '../controllers/serviceController.js';

const router = express.Router();

// GET /api/services - Obtener todos los servicios
router.get('/', serviceController.getServices);

export default router;
