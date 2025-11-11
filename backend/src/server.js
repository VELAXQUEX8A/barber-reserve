import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Configuración de base de datos
import { testConnection } from './config/database.js';

// Rutas
import serviceRoutes from './routes/services.js';
import barberRoutes from './routes/barbers.js';
import bookingRoutes from './routes/bookings.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares - CORS CONFIGURADO CORRECTAMENTE
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/services', serviceRoutes);
app.use('/api/barbers', barberRoutes);
app.use('/api/bookings', bookingRoutes);

// Ruta de salud
app.get('/api/health', async (req, res) => {
  const dbStatus = await testConnection();
  
  res.json({
    status: 'OK',
    message: 'Barbería API funcionando correctamente',
    database: dbStatus ? 'Conectado' : 'Error',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Ruta de inicio
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a BarberReserve API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      services: '/api/services',
      barbers: '/api/barbers',
      bookings: '/api/bookings'
    }
  });
});

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log('🚀 BarberReserve Backend');
  console.log('='.repeat(50));
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`📊 API: http://localhost:${PORT}/api`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
  
  // Probar conexión a la base de datos
  await testConnection();
});