import React from 'react';
import { useBooking } from '../context/BookingContext';

const DebugInfo = () => {
  const { services, barbers, loading, error } = useBooking();
  
  return (
    <div style={{ 
      background: '#f8f9fa', 
      padding: '1rem', 
      margin: '1rem 0',
      border: '2px solid #dc3545',
      borderRadius: '8px'
    }}>
      <h4>🔍 Información de Debug:</h4>
      <p><strong>Loading:</strong> {loading ? 'Sí' : 'No'}</p>
      <p><strong>Error:</strong> {error || 'No hay error'}</p>
      <p><strong>Servicios cargados:</strong> {services.length}</p>
      <p><strong>Barberos cargados:</strong> {barbers.length}</p>
      <p><strong>BookingForm importado:</strong> Sí</p>
    </div>
  );
};

export default DebugInfo;
