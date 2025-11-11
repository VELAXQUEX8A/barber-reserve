import React from 'react';
import '../styles/components/Footer.css';

const Footer = () => {
  return (
    <footer id="contacto">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>BarberShop Pro</h3>
            <p>Tu estilo es nuestra pasión. Reserva tu cita y experimenta el mejor servicio de barbería.</p>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>📍 Calle Principal 123, Ciudad</p>
            <p>📞 (123) 456-7890</p>
            <p>📧 info@barbershoppro.com</p>
          </div>
          
          <div className="footer-section">
            <h4>Horario</h4>
            <p>Lunes - Viernes: 9:00 - 19:00</p>
            <p>Sábado: 9:00 - 17:00</p>
            <p>Domingo: Cerrado</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 BarberShop Pro. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
