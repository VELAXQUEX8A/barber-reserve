import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Datos hardcodeados para desarrollo
const services = [
  { id: 1, name: 'Corte de Cabello', description: 'Corte profesional con técnicas modernas', price: '25.00', duration_minutes: 30 },
  { id: 2, name: 'Afeitado Clásico', description: 'Afeitado tradicional con navaja', price: '20.00', duration_minutes: 30 },
  { id: 3, name: 'Corte y Barba', description: 'Combo completo de corte y arreglo de barba', price: '40.00', duration_minutes: 60 },
  { id: 4, name: 'Coloración', description: 'Servicio de coloración profesional', price: '35.00', duration_minutes: 90 }
];

const barbers = [
  { id: 1, name: 'Carlos Méndez', specialty: 'Cortes clásicos y tradicionales', email: 'carlos@barberia.com', phone: '+1234567890' },
  { id: 2, name: 'Miguel Ángel', specialty: 'Estilos modernos y tendencias', email: 'miguel@barberia.com', phone: '+1234567891' },
  { id: 3, name: 'Roberto Silva', specialty: 'Especialista en afeitado con navaja', email: 'roberto@barberia.com', phone: '+1234567892' },
  { id: 4, name: 'David López', specialty: 'Coloración y tratamientos capilares', email: 'david@barberia.com', phone: '+1234567893' }
];

// Rutas
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend temporal funcionando',
    database: 'Datos hardcodeados',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    data: services,
    count: services.length
  });
});

app.get('/api/barbers', (req, res) => {
  res.json({
    success: true,
    data: barbers,
    count: barbers.length
  });
});

app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    data: [],
    count: 0
  });
});

app.listen(PORT, () => {
  console.log('🚀 BACKEND TEMPORAL funcionando en http://localhost:' + PORT);
  console.log('📊 Usando datos hardcodeados para desarrollo');
});
