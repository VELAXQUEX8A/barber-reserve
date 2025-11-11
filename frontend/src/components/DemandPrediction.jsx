import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';
import '../styles/components/DemandPrediction.css';

const DemandPrediction = () => {
  const { getFutureDemand, bookings } = useBooking();
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      setPrediction(getFutureDemand());
    }
  }, [bookings, getFutureDemand]);

  if (!prediction) {
    return (
      <div className="demand-prediction">
        <div className="loading">Cargando predicciones...</div>
      </div>
    );
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'fuertemente creciente': return '🚀';
      case 'creciente': return '📈';
      case 'decreciente': return '📉';
      case 'fuertemente decreciente': return '🔻';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'fuertemente creciente':
      case 'creciente': return 'positive';
      case 'decreciente':
      case 'fuertemente decreciente': return 'negative';
      default: return 'neutral';
    }
  };

  const getConfidenceColor = (confidence) => {
    switch(confidence) {
      case 'alta': return 'positive';
      case 'media': return 'warning';
      case 'baja': return 'negative';
      default: return 'neutral';
    }
  };

  // Nombres de los próximos meses
  const getNextMonths = () => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentDate = new Date();
    const nextMonths = [];
    
    for (let i = 0; i < 6; i++) {
      const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + i + 1, 1);
      const monthName = months[nextMonth.getMonth()];
      const year = nextMonth.getFullYear();
      nextMonths.push(`${monthName} ${year}`);
    }
    
    return nextMonths;
  };

  const nextMonths = getNextMonths();

  return (
    <div className="demand-prediction">
      <div className="prediction-header">
        <h3>🔮 Predicción de Demanda Futura</h3>
        <p>Análisis predictivo basado en datos históricos</p>
      </div>

      <div className="prediction-grid">
        {/* Tarjeta de Resumen Principal */}
        <div className="prediction-card main-card">
          <div className="card-header">
            <h4>Próximo Mes</h4>
            <span className={`confidence-badge ${getConfidenceColor(prediction.confidence)}`}>
              Confianza: {prediction.confidence}
            </span>
          </div>
          <div className="prediction-main">
            <div className="prediction-value">{prediction.nextMonthPrediction}</div>
            <div className="prediction-label">reservas estimadas</div>
          </div>
          <div className={`trend-indicator ${getTrendColor(prediction.trend)}`}>
            <span className="trend-icon">{getTrendIcon(prediction.trend)}</span>
            <span className="trend-text">{prediction.trend}</span>
            <span className="growth-rate">({prediction.growthRate}%)</span>
          </div>
        </div>

        {/* Tarjeta de Tendencia */}
        <div className="prediction-card">
          <h4>📊 Tendencia Actual</h4>
          <div className="trend-details">
            <div className="trend-item">
              <span>Dirección:</span>
              <strong className={getTrendColor(prediction.trend)}>
                {getTrendIcon(prediction.trend)} {prediction.trend}
              </strong>
            </div>
            <div className="trend-item">
              <span>Tasa de Crecimiento:</span>
              <strong>{prediction.growthRate}%</strong>
            </div>
            <div className="trend-item">
              <span>Confianza del Modelo:</span>
              <strong className={getConfidenceColor(prediction.confidence)}>
                {prediction.rSquared}%
              </strong>
            </div>
          </div>
        </div>

        {/* Predicciones de los próximos meses */}
        <div className="prediction-card full-width">
          <h4>📅 Proyección de los Próximos 6 Meses</h4>
          <div className="monthly-predictions">
            {prediction.predictions.map((pred, index) => (
              <div key={index} className="month-prediction">
                <div className="month-name">{nextMonths[index]}</div>
                <div className="prediction-bar">
                  <div 
                    className="prediction-fill"
                    style={{ 
                      width: `${(pred / Math.max(...prediction.predictions)) * 100}%`,
                      backgroundColor: index === 0 ? 'var(--primary-color)' : 'var(--accent-color)'
                    }}
                  ></div>
                </div>
                <div className="prediction-count">{pred} reservas</div>
              </div>
            ))}
          </div>
        </div>

        {/* Datos Históricos */}
        <div className="prediction-card full-width">
          <h4>📋 Datos Históricos (Últimos 12 meses)</h4>
          <div className="historical-data">
            {prediction.monthlyData.slice(-12).map((data, index) => (
              <div key={index} className="historical-month">
                <div className="month-label">{data.month}</div>
                <div className="month-stats">
                  <span className="stat">{data.bookings} reservas</span>
                  <span className="stat">${data.revenue.toLocaleString()}</span>
                  <span className="stat confirm-rate">
                    {(data.confirmed / data.bookings * 100).toFixed(1)}% confirmadas
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights y Recomendaciones */}
        <div className="prediction-card insights-card">
          <h4>💡 Insights y Recomendaciones</h4>
          <div className="insights-list">
            {prediction.trend.includes('creciente') && (
              <div className="insight positive">
                <strong>Oportunidad de Crecimiento</strong>
                <p>Considera ampliar horarios o contratar personal adicional para la demanda proyectada.</p>
              </div>
            )}
            
            {prediction.trend.includes('decreciente') && (
              <div className="insight warning">
                <strong>Acción Recomendada</strong>
                <p>Evalúa estrategias de marketing y promociones para impulsar la demanda.</p>
              </div>
            )}
            
            {prediction.confidence === 'baja' && (
              <div className="insight info">
                <strong>Más Datos Necesarios</strong>
                <p>La predicción mejorará con más datos históricos. Sigue monitoreando.</p>
              </div>
            )}
            
            <div className="insight tip">
              <strong>Tip Estratégico</strong>
              <p>Prepara tu inventario y personal según la proyección del próximo mes: <strong>{prediction.nextMonthPrediction} reservas</strong>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;