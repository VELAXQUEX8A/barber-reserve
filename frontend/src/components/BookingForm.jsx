import React, { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import '../styles/components/BookingForm.css';

const BookingForm = () => {
  const { services, barbers, addBooking } = useBooking();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    service: '',
    barber: '',
    date: '',
    time: '10:00',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const steps = [
    { id: 1, number: 1, label: 'Servicio' },
    { id: 2, number: 2, label: 'Barbero' },
    { id: 3, number: 3, label: 'Fecha/Hora' },
    { id: 4, number: 4, label: 'Datos' },
    { id: 5, number: 5, label: 'Confirmación' }
  ];

  // Horarios disponibles
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step) => {
    switch(step) {
      case 1:
        return bookingData.service !== '';
      case 2:
        return bookingData.barber !== '';
      case 3:
        return bookingData.date !== '' && bookingData.time !== '';
      case 4:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return bookingData.name !== '' && 
               bookingData.phone !== '' && 
               bookingData.email !== '' && 
               emailRegex.test(bookingData.email);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('Por favor completa todos los campos requeridos');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📤 Enviando reserva...', bookingData);
      
      // Encontrar IDs reales de servicio y barbero
      const service = services.find(s => s.name === bookingData.service);
      const barber = barbers.find(b => b.name === bookingData.barber);
      
      const bookingPayload = {
        customerName: bookingData.name,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        serviceId: service?.id || 1,
        barberId: barber?.id || 1,
        bookingDate: bookingData.date,
        bookingTime: bookingData.time,
        customerNotes: bookingData.notes || 'Sin notas adicionales'
      };

      console.log('📝 Payload procesado:', bookingPayload);
      
      await addBooking(bookingPayload);
      setBookingSuccess(true);
      setCurrentStep(5);
      
    } catch (error) {
      console.error('❌ Error en submit:', error);
      alert('Error al crear la reserva: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setBookingData({
      service: '',
      barber: '',
      date: '',
      time: '10:00',
      name: '',
      email: '',
      phone: '',
      notes: ''
    });
    setBookingSuccess(false);
  };

  // Indicador de pasos
  const StepIndicator = () => (
    <div className="step-indicator">
      {steps.map((step) => (
        <div 
          key={step.id} 
          className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
        >
          <div className="step-number">{step.number}</div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );

  // Pantalla de confirmación
  if (currentStep === 5) {
    return (
      <div className="booking-form">
        <div className="confirmation">
          <div className="confirmation-icon">✅</div>
          <h3>¡Reserva Confirmada!</h3>
          <p>Tu cita ha sido reservada exitosamente. Te hemos enviado un correo de confirmación.</p>
          
          <div className="booking-details">
            <h4>Detalles de tu reserva:</h4>
            <p><strong>Servicio:</strong> {bookingData.service}</p>
            <p><strong>Barbero:</strong> {bookingData.barber}</p>
            <p><strong>Fecha:</strong> {new Date(bookingData.date).toLocaleDateString('es-ES', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            })}</p>
            <p><strong>Hora:</strong> {bookingData.time}</p>
            <p><strong>Cliente:</strong> {bookingData.name}</p>
            <p><strong>Teléfono:</strong> {bookingData.phone}</p>
            <p><strong>Email:</strong> {bookingData.email}</p>
            {bookingData.notes && <p><strong>Notas:</strong> {bookingData.notes}</p>}
          </div>

          <div className="confirmation-actions">
            <button className="btn" onClick={resetForm}>
              Hacer Otra Reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-form">
      <StepIndicator />
      
      <div className="form-content">
        {/* Paso 1: Servicio */}
        {currentStep === 1 && (
          <div className="step-content">
            <h3>Selecciona un Servicio</h3>
            <div className="form-group">
              <label htmlFor="service">Servicio *</label>
              <select 
                id="service"
                name="service"
                value={bookingData.service}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Selecciona un servicio</option>
                {services.map(service => (
                  <option key={service.id} value={service.name}>
                    {service.name} - ${service.price} ({service.duration_minutes} min)
                  </option>
                ))}
              </select>
            </div>
            <div className="form-navigation">
              <div></div>
              <button 
                className="btn" 
                onClick={nextStep}
                disabled={!bookingData.service}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Barbero */}
        {currentStep === 2 && (
          <div className="step-content">
            <h3>Selecciona tu Barbero</h3>
            <div className="form-group">
              <label htmlFor="barber">Barbero *</label>
              <select 
                id="barber"
                name="barber"
                value={bookingData.barber}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Selecciona un barbero</option>
                {barbers.map(barber => (
                  <option key={barber.id} value={barber.name}>
                    {barber.name} - {barber.specialty}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-navigation">
              <button className="btn btn-secondary" onClick={prevStep}>
                Anterior
              </button>
              <button 
                className="btn" 
                onClick={nextStep}
                disabled={!bookingData.barber}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Fecha y Hora */}
        {currentStep === 3 && (
          <div className="step-content">
            <h3>Selecciona Fecha y Hora</h3>
            <div className="form-group">
              <label htmlFor="date">Fecha *</label>
              <input 
                type="date" 
                id="date"
                name="date"
                value={bookingData.date}
                onChange={handleInputChange}
                className="form-control" 
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Hora *</label>
              <select 
                id="time"
                name="time"
                value={bookingData.time}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">Selecciona una hora</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            
            <div className="form-navigation">
              <button className="btn btn-secondary" onClick={prevStep}>
                Anterior
              </button>
              <button 
                className="btn" 
                onClick={nextStep}
                disabled={!bookingData.date || !bookingData.time}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Datos Personales */}
        {currentStep === 4 && (
          <div className="step-content">
            <h3>Tus Datos</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Nombre Completo *</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={bookingData.name}
                  onChange={handleInputChange}
                  className="form-control" 
                  required 
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleInputChange}
                  className="form-control" 
                  required 
                  placeholder="Ej: juan@email.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Teléfono *</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleInputChange}
                  className="form-control" 
                  required 
                  placeholder="Ej: +1234567890"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notas Adicionales</label>
                <textarea 
                  id="notes"
                  name="notes"
                  value={bookingData.notes}
                  onChange={handleInputChange}
                  className="form-control" 
                  rows="3"
                  placeholder="Alguna preferencia especial o comentario..."
                ></textarea>
              </div>

              <div className="form-navigation">
                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                  Anterior
                </button>
                <button 
                  type="submit" 
                  className="btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
