-- Crear base de datos
CREATE DATABASE barberia_reservas;

-- Conectar a la base de datos
\c barberia_reservas;

-- Tabla de servicios
CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de barberos
CREATE TABLE barbers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(200),
    email VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    preferences JSONB,
    bookings_count INTEGER DEFAULT 0,
    last_booking_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    service_id INTEGER REFERENCES services(id) NOT NULL,
    barber_id INTEGER REFERENCES barbers(id) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO services (name, description, price, duration_minutes) VALUES
('Corte de Cabello', 'Corte profesional con técnicas modernas', 25.00, 30),
('Afeitado Clásico', 'Afeitado tradicional con navaja', 20.00, 30),
('Corte y Barba', 'Combo completo de corte y arreglo de barba', 40.00, 60),
('Coloración', 'Servicio de coloración profesional', 35.00, 90);

INSERT INTO barbers (name, specialty, email, phone) VALUES
('Carlos Méndez', 'Cortes clásicos y tradicionales', 'carlos@barberia.com', '+1234567890'),
('Miguel Ángel', 'Estilos modernos y tendencias', 'miguel@barberia.com', '+1234567891'),
('Roberto Silva', 'Especialista en afeitado con navaja', 'roberto@barberia.com', '+1234567892'),
('David López', 'Coloración y tratamientos capilares', 'david@barberia.com', '+1234567893');

-- Crear índices para mejor performance
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_customers_email ON customers(email);
