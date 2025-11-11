// backend/server-simple.js - Backend COMPLETO con todas las rutas
import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Datos de ejemplo
const services = [
  { id: 1, name: "Corte de Cabello", description: "Corte profesional con técnicas modernas", price: "25.00", duration_minutes: 30 },
  { id: 2, name: "Afeitado Clásico", description: "Afeitado tradicional con navaja", price: "20.00", duration_minutes: 30 },
  { id: 3, name: "Corte y Barba", description: "Combo completo de corte y arreglo de barba", price: "40.00", duration_minutes: 60 },
  { id: 4, name: "Coloración", description: "Servicio de coloración profesional", price: "35.00", duration_minutes: 90 }
];

const barbers = [
  { id: 1, name: "Carlos Méndez", specialty: "Cortes clásicos", email: "carlos@barberia.com", phone: "+1234567890" },
  { id: 2, name: "Miguel Ángel", specialty: "Estilos modernos", email: "miguel@barberia.com", phone: "+1234567891" },
  { id: 3, name: "Roberto Silva", specialty: "Afeitado con navaja", email: "roberto@barberia.com", phone: "+1234567892" },
  { id: 4, name: "David López", specialty: "Coloración", email: "david@barberia.com", phone: "+1234567893" }
];

let bookings = []; // Array para almacenar reservas

// Ruta de salud
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "✅ Backend funcionando correctamente",
    timestamp: new Date().toISOString()
  });
});

// Servicios
app.get("/api/services", (req, res) => {
  console.log("📦 Enviando servicios...");
  res.json({
    success: true,
    data: services,
    count: services.length
  });
});

// Barberos  
app.get("/api/barbers", (req, res) => {
  console.log("💈 Enviando barberos...");
  res.json({
    success: true,
    data: barbers,
    count: barbers.length
  });
});

// Obtener reservas
app.get("/api/bookings", (req, res) => {
  console.log("📋 Enviando reservas...");
  res.json({
    success: true,
    data: bookings,
    count: bookings.length
  });
});

// CREAR RESERVA - ENDPOINT CRÍTICO
app.post("/api/bookings", (req, res) => {
  try {
    console.log("➕ Creando nueva reserva:", req.body);
    
    const { customerName, customerEmail, customerPhone, serviceId, barberId, bookingDate, bookingTime, customerNotes } = req.body;
    
    // Validar datos requeridos
    if (!customerName || !customerEmail || !customerPhone || !bookingDate || !bookingTime) {
      return res.status(400).json({
        success: false,
        error: "Faltan datos requeridos"
      });
    }
    
    // Encontrar servicio y barbero por nombre (para simulación)
    const service = services.find(s => s.id === serviceId) || services[0];
    const barber = barbers.find(b => b.id === barberId) || barbers[0];
    
    const newBooking = {
      id: Date.now(),
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      service_name: service.name,
      barber_name: barber.name,
      booking_date: bookingDate,
      booking_time: bookingTime,
      customer_notes: customerNotes || '',
      status: 'pending',
      created_at: new Date().toISOString(),
      service_price: service.price,
      service_duration: service.duration_minutes
    };
    
    // Agregar a la lista de reservas
    bookings.push(newBooking);
    
    console.log("✅ Reserva creada exitosamente:", newBooking.id);
    
    res.status(201).json({
      success: true,
      data: newBooking,
      message: "Reserva creada exitosamente"
    });
    
  } catch (error) {
    console.error("❌ Error creando reserva:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor: " + error.message
    });
  }
});

// Actualizar estado de reserva
app.put("/api/bookings/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log(`🔄 Actualizando reserva ${id} a estado: ${status}`);
  
  const booking = bookings.find(b => b.id === parseInt(id));
  if (!booking) {
    return res.status(404).json({
      success: false,
      error: "Reserva no encontrada"
    });
  }
  
  booking.status = status;
  booking.updated_at = new Date().toISOString();
  
  res.json({
    success: true,
    data: booking,
    message: `Reserva ${status}`
  });
});

// Eliminar reserva
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  
  console.log(`🗑️ Eliminando reserva: ${id}`);
  
  const index = bookings.findIndex(b => b.id === parseInt(id));
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Reserva no encontrada"
    });
  }
  
  bookings.splice(index, 1);
  
  res.json({
    success: true,
    message: "Reserva eliminada exitosamente"
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.json({
    message: "🚀 BarberReserve API funcionando",
    version: "1.0.0",
    endpoints: [
      "GET /api/health",
      "GET /api/services", 
      "GET /api/barbers",
      "GET /api/bookings",
      "POST /api/bookings",
      "PUT /api/bookings/:id/status",
      "DELETE /api/bookings/:id"
    ]
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Ruta no encontrada: " + req.method + " " + req.url
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log("🎉 BACKEND COMPLETO INICIADO!");
  console.log("📍 http://localhost:" + PORT);
  console.log("🔍 Health: http://localhost:" + PORT + "/api/health");
  console.log("📦 Services: http://localhost:" + PORT + "/api/services");
  console.log("💈 Barbers: http://localhost:" + PORT + "/api/barbers");
  console.log("📋 Bookings: http://localhost:" + PORT + "/api/bookings");
  console.log("➕ POST Bookings: http://localhost:" + PORT + "/api/bookings");
});
