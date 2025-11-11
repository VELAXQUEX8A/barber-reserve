import React from 'react';
import '../styles/components/Hero.css';

const Hero = () => {
  const scrollToReservas = () => {
    const element = document.getElementById('reservas');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="inicio">
      <div className="container">
        <h1>Tu Estilo, Nuestra Pasión</h1>
        <p>Reserva tu cita en la mejor barbería de la ciudad. Cortes clásicos y modernos con los mejores profesionales.</p>
        <button className="btn" onClick={scrollToReservas}>Reservar Ahora</button>
      </div>
    </section>
  );
};

export default Hero;
