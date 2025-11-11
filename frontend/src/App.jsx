import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider, useBooking } from './context/BookingContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Barbers from './components/Barbers';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import './index.css';

// Componente para la página principal (home)
function HomePage() {
  const { loading, error } = useBooking();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💈</div>
        <h2>Cargando BarberReserve...</h2>
        <p>Por favor espera un momento</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>❌</div>
        <h2>Error al cargar la aplicación</h2>
        <p style={{ color: 'red', background: '#ffe6e6', padding: '1rem', borderRadius: '4px' }}>
          {error}
        </p>
        <button 
          className="btn"
          onClick={() => window.location.reload()}
          style={{ marginTop: '1rem' }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <Hero />
      <Services />
      <Barbers />
      
      {/* Sección de Reservas */}
      <section className="section" id="reservas">
        <div className="container">
          <h2 className="section-title">Reserva tu Cita</h2>
          <BookingForm />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

// Layout para el panel de administración (CON HEADER)
function AdminLayout() {
  return (
    <div className="admin-layout">
      <Header />
      <AdminPanel />
    </div>
  );
}

// Componente para página no encontrada
function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
      <h2>Página No Encontrada</h2>
      <p>La página que buscas no existe.</p>
      <a href="/" className="btn" style={{ marginTop: '1rem' }}>
        Volver al Inicio
      </a>
    </div>
  );
}

// Componente principal de la aplicación
function App() {
  return (
    <BookingProvider>
      <Router>
        <Routes>
          {/* Ruta para la página principal */}
          <Route path="/" element={<HomePage />} />
          
          {/* Ruta para el panel de administración */}
          <Route path="/admin" element={<AdminLayout />} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </BookingProvider>
  );
}

export default App;