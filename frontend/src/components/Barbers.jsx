import React from 'react';
import { useBooking } from '../context/BookingContext';
import '../styles/components/Barbers.css';

const Barbers = () => {
  const { barbers } = useBooking();

  return (
    <section className="section" id="barberos">
      <div className="container">
        <h2 className="section-title">Nuestros Barberos</h2>
        <div className="barbers-grid">
          {barbers.map(barber => (
            <div key={barber.id} className="barber-card">
              <div className="barber-avatar">
                {barber.name.charAt(0)}
              </div>
              <h3>{barber.name}</h3>
              <p className="specialty">{barber.specialty}</p>
              {barber.email && <p className="contact">📧 {barber.email}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Barbers;
