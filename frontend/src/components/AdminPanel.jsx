import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import AnalyticsPanel from './AnalyticsPanel';
import '../styles/components/AdminPanel.css';

const AdminPanel = () => {
  const { bookings, services, barbers, updateBookingStatus, deleteBooking, refreshData, loading, error } = useBooking();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    console.log('🔍 AdminPanel State:', {
      bookingsCount: bookings?.length,
      servicesCount: services?.length,
      barbersCount: barbers?.length,
      loading,
      error
    });
  }, [bookings, services, barbers, loading, error]);

  if (loading) {
    return (
      <section className="admin-panel" id="admin">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner">💈</div>
            <h3>Cargando datos del administración...</h3>
            <p>Por favor espera un momento</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="admin-panel" id="admin">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Error al cargar los datos</h3>
            <p>{error}</p>
            <button className="btn btn-retry" onClick={refreshData}>
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <section className="admin-panel" id="admin">
        <div className="container">
          <div className="admin-header">
            <h2 className="section-title">Panel de Administración</h2>
            <p>Gestiona todas las reservas de tu barbería</p>
          </div>
          
          <div className="no-data-state">
            <div className="no-data-icon">📭</div>
            <h3>No hay reservas aún</h3>
            <p>Cuando los clientes hagan reservas, aparecerán aquí.</p>
            <button className="btn btn-refresh" onClick={refreshData}>
              🔄 Actualizar
            </button>
          </div>
        </div>
      </section>
    );
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesDate = !selectedDate || booking.booking_date === selectedDate;
    const matchesSearch = 
      booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesDate && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    today: bookings.filter(b => b.booking_date === new Date().toISOString().split('T')[0]).length
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      alert(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'} exitosamente`);
    } catch (error) {
      alert('Error al actualizar la reserva: ' + error.message);
    }
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reserva?')) {
      try {
        await deleteBooking(bookingId);
        alert('Reserva eliminada exitosamente');
      } catch (error) {
        alert('Error al eliminar la reserva: ' + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'confirmed': return 'Confirmada';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  return (
    <section className="admin-panel" id="admin">
      <div className="container">
        <div className="admin-header">
          <h2 className="section-title">Panel de Administración</h2>
          <p>Gestiona todas las reservas de tu barbería</p>
        </div>

        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total Reservas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pendientes</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.confirmed}</h3>
              <p>Confirmadas</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.today}</h3>
              <p>Hoy</p>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ANÁLISIS DE DATOS */}
        <div className="admin-controls">
          <div className="control-group">
            <button 
              className={`btn analytics-btn ${showAnalytics ? 'btn-active' : ''}`}
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              {showAnalytics ? '📊 Ocultar Análisis' : '📈 Ver Análisis de Datos'}
            </button>
          </div>

          <div className="control-group">
            <label>Filtrar por estado:</label>
            <div className="tab-buttons">
              <button 
                className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Todas ({stats.total})
              </button>
              <button 
                className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pendientes ({stats.pending})
              </button>
              <button 
                className={`tab-button ${activeTab === 'confirmed' ? 'active' : ''}`}
                onClick={() => setActiveTab('confirmed')}
              >
                Confirmadas ({stats.confirmed})
              </button>
              <button 
                className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
                onClick={() => setActiveTab('cancelled')}
              >
                Canceladas ({stats.cancelled})
              </button>
            </div>
          </div>

          <div className="control-group">
            <label htmlFor="date-filter">Filtrar por fecha:</label>
            <input
              type="date"
              id="date-filter"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="control-group">
            <label htmlFor="search">Buscar:</label>
            <input
              type="text"
              id="search"
              placeholder="Buscar por nombre, email o servicio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          <button className="btn btn-refresh" onClick={refreshData}>
            🔄 Actualizar
          </button>
        </div>

        {/* PANEL DE ANÁLISIS DE DATOS */}
        {showAnalytics && <AnalyticsPanel />}

        <div className="bookings-list">
          <h3>Reservas ({filteredBookings.length})</h3>
          
          {filteredBookings.length === 0 ? (
            <div className="no-bookings">
              <div className="no-bookings-icon">📭</div>
              <h4>No hay reservas con estos filtros</h4>
              <p>Intenta cambiar los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {filteredBookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <div className="booking-customer">
                      <h4>{booking.customer_name}</h4>
                      <p className="customer-contact">
                        📧 {booking.customer_email} | 📞 {booking.customer_phone}
                      </p>
                    </div>
                    <div 
                      className="booking-status"
                      style={{ backgroundColor: getStatusColor(booking.status) }}
                    >
                      {getStatusText(booking.status)}
                    </div>
                  </div>

                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="detail-label">Servicio:</span>
                      <span className="detail-value">{booking.service_name} - ${booking.service_price}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Barbero:</span>
                      <span className="detail-value">{booking.barber_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Fecha y Hora:</span>
                      <span className="detail-value">
                        {formatDate(booking.booking_date)} a las {booking.booking_time}
                      </span>
                    </div>
                    {booking.customer_notes && (
                      <div className="detail-row">
                        <span className="detail-label">Notas:</span>
                        <span className="detail-value notes">{booking.customer_notes}</span>
                      </div>
                    )}
                    <div className="detail-row">
                      <span className="detail-label">Creado:</span>
                      <span className="detail-value">
                        {new Date(booking.created_at).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {booking.status === 'pending' && (
                      <>
                        <button 
                          className="btn btn-confirm"
                          onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                        >
                          ✅ Confirmar
                        </button>
                        <button 
                          className="btn btn-cancel"
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        >
                          ❌ Cancelar
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <button 
                        className="btn btn-cancel"
                        onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                      >
                        ❌ Cancelar
                      </button>
                    )}

                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDelete(booking.id)}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-summary">
          <h4>Resumen Rápido</h4>
          <div className="summary-cards">
            <div className="summary-card">
              <h5>Próximas Reservas de Hoy</h5>
              <ul>
                {bookings
                  .filter(b => b.booking_date === new Date().toISOString().split('T')[0] && b.status !== 'cancelled')
                  .sort((a, b) => a.booking_time.localeCompare(b.booking_time))
                  .slice(0, 3)
                  .map(booking => (
                    <li key={booking.id}>
                      <strong>{booking.booking_time}</strong> - {booking.customer_name} ({booking.service_name})
                    </li>
                  ))}
              </ul>
            </div>
            <div className="summary-card">
              <h5>Reservas Pendientes</h5>
              <ul>
                {bookings
                  .filter(b => b.status === 'pending')
                  .slice(0, 3)
                  .map(booking => (
                    <li key={booking.id}>
                      {booking.customer_name} - {formatDate(booking.booking_date)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;