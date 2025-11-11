import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/components/Header.css';

const Header = () => {
  const location = useLocation();

  const scrollToSection = (sectionId) => {
    // Solo funciona en la página principal (/)
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isAdminRoute = location.pathname === '/admin';

  return (
    <header className="header">
      <div className="container">
        <nav className="navbar">
          <div className="logo">
            <Link to="/">
              💈 BarberReserve
            </Link>
          </div>
          <ul className="nav-links">
            {!isAdminRoute ? (
              // Vista cliente (ruta principal)
              <>
                <li>
                  <a 
                    href="#inicio" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      scrollToSection('inicio'); 
                    }}
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a 
                    href="#servicios" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      scrollToSection('servicios'); 
                    }}
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <a 
                    href="#barberos" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      scrollToSection('barberos'); 
                    }}
                  >
                    Barberos
                  </a>
                </li>
                <li>
                  <a 
                    href="#reservas" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      scrollToSection('reservas'); 
                    }}
                  >
                    Reservas
                  </a>
                </li>
              </>
            ) : (
              // Vista administrador
              <li>
                <span className="admin-view-indicator">🔧 Vista de Administrador</span>
              </li>
            )}
            
            <li>
              {!isAdminRoute ? (
                // En la vista cliente: botón para ir al admin
                <Link to="/admin" className="admin-btn">
                  🔧 Panel Admin
                </Link>
              ) : (
                // En la vista admin: botón para volver al sitio
                <Link to="/" className="admin-btn">
                  ← Volver al Sitio
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;