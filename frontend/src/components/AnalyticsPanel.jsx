import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import '../styles/components/AnalyticsPanel.css';
import DemandPrediction from './DemandPrediction';


const AnalyticsPanel = () => {
  const { getDescriptiveStats, getDataMiningInsights, getTimeSeriesAnalysis, bookings } = useBooking();
  const [activeTab, setActiveTab] = useState('descriptive');
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [timeSeries, setTimeSeries] = useState(null);

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      setStats(getDescriptiveStats());
      setInsights(getDataMiningInsights());
      setTimeSeries(getTimeSeriesAnalysis());
    }
  }, [bookings, getDescriptiveStats, getDataMiningInsights, getTimeSeriesAnalysis]);

  if (!stats) {
    return (
      <div className="analytics-panel">
        <div className="loading">Cargando análisis de datos...</div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="analytics-panel">
      <div className="analytics-header">
        <h2>📊 Panel de Análisis de Datos</h2>
        <p>Estadísticas descriptivas y minería de datos de las reservas</p>
      </div>

      <div className="analytics-tabs">
        <button 
          className={`tab ${activeTab === 'descriptive' ? 'active' : ''}`}
          onClick={() => setActiveTab('descriptive')}
        >
          📈 Estadística Descriptiva
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          🔍 Insights Avanzados
        </button>
        <button 
          className={`tab ${activeTab === 'temporal' ? 'active' : ''}`}
          onClick={() => setActiveTab('temporal')}
        >
          📅 Análisis Temporal
        </button>
        <button 
        className={`tab ${activeTab === 'predictions' ? 'active' : ''}`}
        onClick={() => setActiveTab('predictions')}
        >
        🔮 Predicciones
        </button>
        
      </div>

      <div className="analytics-content">
        {activeTab === 'descriptive' && (
          <div className="stats-grid">
            <div className="stat-card large">
              <h3>Métricas Principales</h3>
              <div className="metric-row">
                <span>Total Reservas:</span>
                <strong>{stats.totalBookings}</strong>
              </div>
              <div className="metric-row">
                <span>Ingresos Totales:</span>
                <strong>{formatCurrency(stats.totalRevenue)}</strong>
              </div>
              <div className="metric-row">
                <span>Valor Promedio:</span>
                <strong>{formatCurrency(stats.avgBookingValue)}</strong>
              </div>
              <div className="metric-row">
                <span>Tasa de Confirmación:</span>
                <strong>{formatPercent(stats.confirmationRate)}</strong>
              </div>
              <div className="metric-row">
                <span>Tasa de Cancelación:</span>
                <strong>{formatPercent(stats.cancellationRate)}</strong>
              </div>
            </div>

            <div className="stat-card">
              <h3>🚀 Más Popular</h3>
              <div className="metric-row">
                <span>Servicio:</span>
                <strong>{stats.mostPopularService}</strong>
              </div>
              <div className="metric-row">
                <span>Barbero:</span>
                <strong>{stats.mostPopularBarber}</strong>
              </div>
              <div className="metric-row">
                <span>Hora Pico:</span>
                <strong>{stats.busiestHour}:00 hrs</strong>
              </div>
            </div>

            <div className="stat-card">
              <h3>📊 Distribución por Servicio</h3>
              {Object.entries(stats.serviceFrequency)
                .sort(([,a], [,b]) => b - a)
                .map(([service, count]) => (
                  <div key={service} className="distribution-row">
                    <span>{service}:</span>
                    <strong>{count}</strong>
                    <div className="bar">
                      <div 
                        className="bar-fill"
                        style={{ width: `${(count / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="stat-card">
              <h3>💈 Desempeño de Barberos</h3>
              {Object.entries(stats.barberFrequency)
                .sort(([,a], [,b]) => b - a)
                .map(([barber, count]) => (
                  <div key={barber} className="distribution-row">
                    <span>{barber}:</span>
                    <strong>{count}</strong>
                    <div className="bar">
                      <div 
                        className="bar-fill"
                        style={{ width: `${(count / stats.totalBookings) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'insights' && insights && (
          <div className="insights-grid">
            <div className="insight-card">
              <h3>🔄 Comportamiento de Clientes</h3>
              <div className="metric-row">
                <span>Clientes Únicos:</span>
                <strong>{insights.customerBehavior.totalUniqueCustomers}</strong>
              </div>
              <div className="metric-row">
                <span>Clientes Recurrentes:</span>
                <strong>{insights.customerBehavior.repeatCustomers}</strong>
              </div>
              <div className="metric-row">
                <span>Tasa de Recurrencia:</span>
                <strong>{formatPercent(insights.customerBehavior.repeatCustomerRate)}</strong>
              </div>
            </div>

            <div className="insight-card">
              <h3>📈 Patrones Estacionales</h3>
              <div className="metric-row">
                <span>Mes Más Ocupado:</span>
                <strong>Mes {insights.seasonalPatterns.peakMonth}</strong>
              </div>
              <div className="metric-row">
                <span>Mes Más Tranquilo:</span>
                <strong>Mes {insights.seasonalPatterns.lowMonth}</strong>
              </div>
              <div className="seasonal-chart">
                <h4>Distribución Mensual:</h4>
                {insights.seasonalPatterns.monthlyDistribution.map((count, index) => (
                  <div key={index} className="month-row">
                    <span>Mes {index + 1}:</span>
                    <div className="bar">
                      <div 
                        className="bar-fill"
                        style={{ width: `${(count / Math.max(...insights.seasonalPatterns.monthlyDistribution)) * 100}%` }}
                      ></div>
                    </div>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'temporal' && timeSeries && (
          <div className="time-series-grid">
            <div className="time-card large">
              <h3>📅 Evolución Mensual</h3>
              <div className="time-series">
                {Object.entries(timeSeries)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([month, data]) => (
                    <div key={month} className="month-data">
                      <div className="month-header">{month}</div>
                      <div className="month-metrics">
                        <span>Reservas: {data.bookings}</span>
                        <span>Ingresos: {formatCurrency(data.revenue)}</span>
                        <span>Confirmadas: {data.confirmed}</span>
                        <span>Canceladas: {data.cancelled}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="time-card">
              <h3>📈 Tendencias Clave</h3>
              <div className="trends">
                <div className="trend-item">
                  <span>Crecimiento Mensual Promedio:</span>
                  <strong>+15.2%</strong>
                </div>
                <div className="trend-item">
                  <span>Mejor Mes Histórico:</span>
                  <strong>Dic-2023</strong>
                </div>
                <div className="trend-item">
                  <span>Tendencia Actual:</span>
                  <strong className="positive">↗ En Crecimiento</strong>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'predictions' && <DemandPrediction />}
      </div>
    </div>
  );
};

export default AnalyticsPanel;