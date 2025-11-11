import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiService } from '../services/api';

const BookingContext = createContext();

const initialState = {
  bookings: [],
  services: [],
  barbers: [],
  loading: false,
  error: null,
  currentView: 'customer'
};

const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_SERVICES: 'SET_SERVICES',
  SET_BARBERS: 'SET_BARBERS',
  SET_BOOKINGS: 'SET_BOOKINGS',
  ADD_BOOKING: 'ADD_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  DELETE_BOOKING: 'DELETE_BOOKING',
  SET_ERROR: 'SET_ERROR',
  SET_VIEW: 'SET_VIEW'
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_SERVICES:
      return { ...state, services: action.payload };
    case ACTIONS.SET_BARBERS:
      return { ...state, barbers: action.payload };
    case ACTIONS.SET_BOOKINGS:
      return { ...state, bookings: action.payload };
    case ACTIONS.ADD_BOOKING:
      return { ...state, bookings: [...state.bookings, action.payload] };
    case ACTIONS.UPDATE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking.id === action.payload.id ? action.payload : booking
        )
      };
    case ACTIONS.DELETE_BOOKING:
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking.id !== action.payload)
      };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_VIEW:
      return { ...state, currentView: action.payload };
    default:
      return state;
  }
};

// Función de predicción (mantenerla fuera del componente)
const predictFutureDemand = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return {
      trend: 'estable',
      growthRate: '0.00',
      nextMonthPrediction: 0,
      predictions: [0, 0, 0, 0, 0, 0],
      monthlyData: [],
      confidence: '0%'
    };
  }

  // Agrupar por mes
  const monthlyData = {};
  bookings.forEach(booking => {
    const date = new Date(booking.booking_date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        bookings: 0,
        revenue: 0,
        confirmed: 0
      };
    }
    
    monthlyData[monthYear].bookings++;
    monthlyData[monthYear].revenue += parseFloat(booking.service_price) || 0;
    if (booking.status === 'confirmed') monthlyData[monthYear].confirmed++;
  });

  // Ordenar meses cronológicamente
  const sortedMonths = Object.keys(monthlyData).sort();
  const bookingsData = sortedMonths.map(month => monthlyData[month].bookings);
  
  if (bookingsData.length < 2) {
    return {
      trend: 'insuficientes datos',
      growthRate: '0.00',
      nextMonthPrediction: bookingsData[0] || 0,
      predictions: [bookingsData[0] || 0],
      monthlyData: sortedMonths.map(month => ({
        month,
        ...monthlyData[month]
      })),
      confidence: 'baja'
    };
  }

  // Regresión lineal para tendencia
  const n = bookingsData.length;
  const x = Array.from({length: n}, (_, i) => i);
  const y = bookingsData;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calcular R² para confianza
  const yMean = sumY / n;
  const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssRes = y.reduce((sum, val, i) => sum + Math.pow(val - (slope * x[i] + intercept), 2), 0);
  const rSquared = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
  
  // Predecir próximos 6 meses
  const predictions = [];
  for (let i = 0; i < 6; i++) {
    const prediction = Math.max(0, Math.round(slope * (n + i) + intercept));
    predictions.push(prediction);
  }
  
  // Determinar tendencia y confianza
  let trend;
  if (slope > 5) trend = 'fuertemente creciente';
  else if (slope > 1) trend = 'creciente';
  else if (slope < -5) trend = 'fuertemente decreciente';
  else if (slope < -1) trend = 'decreciente';
  else trend = 'estable';
  
  let confidence;
  if (rSquared > 0.7) confidence = 'alta';
  else if (rSquared > 0.4) confidence = 'media';
  else confidence = 'baja';

  const growthRate = ((slope / (sumY / n)) * 100).toFixed(2);

  return {
    trend,
    growthRate: Math.abs(growthRate),
    nextMonthPrediction: predictions[0],
    predictions,
    monthlyData: sortedMonths.map(month => ({
      month,
      ...monthlyData[month]
    })),
    confidence,
    rSquared: (rSquared * 100).toFixed(1)
  };
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Función de estadísticas descriptivas
  const calculateDescriptiveStats = (bookings) => {
    if (!bookings || bookings.length === 0) return {};
    
    const prices = bookings.map(b => parseFloat(b.service_price) || 0);
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
    
    // Estadísticas básicas
    const stats = {
      totalBookings: bookings.length,
      totalRevenue: prices.reduce((sum, price) => sum + price, 0),
      avgBookingValue: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      minBookingValue: Math.min(...prices),
      maxBookingValue: Math.max(...prices),
      confirmationRate: (confirmedBookings.length / bookings.length) * 100,
      cancellationRate: (cancelledBookings.length / bookings.length) * 100,
      avgBookingsPerDay: bookings.length / ((new Date() - new Date('2020-01-01')) / (1000 * 60 * 60 * 24))
    };
    
    // Frecuencias
    const serviceFrequency = {};
    const barberFrequency = {};
    const hourFrequency = {};
    const monthFrequency = {};
    
    bookings.forEach(booking => {
      // Frecuencia de servicios
      serviceFrequency[booking.service_name] = (serviceFrequency[booking.service_name] || 0) + 1;
      
      // Frecuencia de barberos
      barberFrequency[booking.barber_name] = (barberFrequency[booking.barber_name] || 0) + 1;
      
      // Frecuencia por hora
      const hour = booking.booking_time.split(':')[0];
      hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
      
      // Frecuencia por mes
      const month = new Date(booking.booking_date).getMonth();
      monthFrequency[month] = (monthFrequency[month] || 0) + 1;
    });
    
    return {
      ...stats,
      serviceFrequency,
      barberFrequency,
      hourFrequency,
      monthFrequency,
      mostPopularService: Object.keys(serviceFrequency).reduce((a, b) => 
        serviceFrequency[a] > serviceFrequency[b] ? a : b
      ),
      mostPopularBarber: Object.keys(barberFrequency).reduce((a, b) => 
        barberFrequency[a] > barberFrequency[b] ? a : b
      ),
      busiestHour: Object.keys(hourFrequency).reduce((a, b) => 
        hourFrequency[a] > hourFrequency[b] ? a : b
      )
    };
  };

  // Función de insights de minería de datos
  const calculateDataMiningInsights = (bookings) => {
    if (!bookings || bookings.length === 0) return {};
    
    const insights = {
      seasonalPatterns: calculateSeasonalPatterns(bookings),
      customerBehavior: calculateCustomerBehavior(bookings),
      revenueTrends: calculateRevenueTrends(bookings),
      serviceCorrelations: calculateServiceCorrelations(bookings)
    };
    
    return insights;
  };

  // Función de análisis de series temporales
  const calculateTimeSeriesAnalysis = (bookings) => {
    if (!bookings || bookings.length === 0) return {};
    
    // Agrupar por mes
    const monthlyData = {};
    bookings.forEach(booking => {
      const date = new Date(booking.booking_date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = {
          bookings: 0,
          revenue: 0,
          confirmed: 0,
          cancelled: 0
        };
      }
      
      monthlyData[monthYear].bookings++;
      monthlyData[monthYear].revenue += parseFloat(booking.service_price) || 0;
      if (booking.status === 'confirmed') monthlyData[monthYear].confirmed++;
      if (booking.status === 'cancelled') monthlyData[monthYear].cancelled++;
    });
    
    return monthlyData;
  };

  // Funciones auxiliares
  const calculateSeasonalPatterns = (bookings) => {
    const monthlyCounts = Array(12).fill(0);
    bookings.forEach(booking => {
      const month = new Date(booking.booking_date).getMonth();
      monthlyCounts[month]++;
    });
    
    return {
      peakMonth: monthlyCounts.indexOf(Math.max(...monthlyCounts)) + 1,
      lowMonth: monthlyCounts.indexOf(Math.min(...monthlyCounts)) + 1,
      monthlyDistribution: monthlyCounts
    };
  };

  const calculateCustomerBehavior = (bookings) => {
    const customerEmails = {};
    bookings.forEach(booking => {
      customerEmails[booking.customer_email] = (customerEmails[booking.customer_email] || 0) + 1;
    });
    
    const repeatCustomers = Object.values(customerEmails).filter(count => count > 1).length;
    
    return {
      totalUniqueCustomers: Object.keys(customerEmails).length,
      repeatCustomers,
      repeatCustomerRate: (repeatCustomers / Object.keys(customerEmails).length) * 100
    };
  };

  const calculateRevenueTrends = (bookings) => {
    const monthlyRevenue = {};
    bookings.forEach(booking => {
      const date = new Date(booking.booking_date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + (parseFloat(booking.service_price) || 0);
    });
    
    return monthlyRevenue;
  };

  const calculateServiceCorrelations = (bookings) => {
    return {
      message: "Análisis de correlación entre servicios",
      note: "Requiere datos más específicos para análisis avanzado"
    };
  };

  useEffect(() => {
    console.log('🎯 BookingProvider montado - iniciando carga de datos');
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      console.log('📡 Iniciando carga de datos...');
      
      await apiService.health();
      console.log('✅ Health check passed');
      
      const [servicesRes, barbersRes, bookingsRes] = await Promise.all([
        apiService.getServices(),
        apiService.getBarbers(),
        apiService.getBookings()
      ]);

      console.log('✅ Datos cargados exitosamente:');
      console.log('- Servicios:', servicesRes.data);
      console.log('- Barbers:', barbersRes.data);
      console.log('- Bookings:', bookingsRes.data);
      
      dispatch({ type: ACTIONS.SET_SERVICES, payload: servicesRes.data });
      dispatch({ type: ACTIONS.SET_BARBERS, payload: barbersRes.data });
      dispatch({ type: ACTIONS.SET_BOOKINGS, payload: bookingsRes.data });
      
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const addBooking = async (bookingData) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      console.log('📝 Creando reserva...');
      const response = await apiService.createBooking(bookingData);
      
      console.log('✅ Reserva creada exitosamente:', response.data);
      dispatch({ type: ACTIONS.ADD_BOOKING, payload: response.data });
      
      return response;
    } catch (error) {
      console.error('❌ Error creando reserva:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      console.log(`🔄 Actualizando reserva ${bookingId} a ${status}`);
      const response = await apiService.updateBookingStatus(bookingId, status);
      
      console.log('✅ Estado actualizado:', response.data);
      dispatch({ type: ACTIONS.UPDATE_BOOKING, payload: response.data });
      
      return response;
    } catch (error) {
      console.error('❌ Error actualizando reserva:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const deleteBooking = async (bookingId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      console.log(`🗑️ Eliminando reserva: ${bookingId}`);
      await apiService.deleteBooking(bookingId);
      
      console.log('✅ Reserva eliminada');
      dispatch({ type: ACTIONS.DELETE_BOOKING, payload: bookingId });
      
    } catch (error) {
      console.error('❌ Error eliminando reserva:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };

  const setCurrentView = (view) => {
    dispatch({ type: ACTIONS.SET_VIEW, payload: view });
  };

  // Valor del contexto
  const value = {
    ...state,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    setCurrentView,
    refreshData: loadInitialData,
    getDescriptiveStats: () => calculateDescriptiveStats(state.bookings),
    getDataMiningInsights: () => calculateDataMiningInsights(state.bookings),
    getTimeSeriesAnalysis: () => calculateTimeSeriesAnalysis(state.bookings),
    getFutureDemand: () => predictFutureDemand(state.bookings) // Agregar esta línea
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking debe ser usado dentro de un BookingProvider');
  }
  return context;
};