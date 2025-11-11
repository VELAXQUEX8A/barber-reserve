import React from 'react';
import { useBooking } from '../context/BookingContext';
import '../styles/components/Services.css';

const Services = () => {
  const { services } = useBooking();

  return (
    <section className="section" id="servicios">
      <div className="container">
        <h2 className="section-title">Nuestros Servicios</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-info">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-price">${service.price}</div>
                <div className="service-duration">{service.duration_minutes} min</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
