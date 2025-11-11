const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log(`🔄 API Call: ${url}`, options.method || 'GET');
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error(`❌ API Error ${response.status}:`, data);
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      console.log(`✅ API Success: ${url}`, data);
      return data;

    } catch (error) {
      console.error(`❌ Network Error: ${url}`, error);
      throw error;
    }
  }

  // Health check
  async health() {
    return this.request('/health');
  }

  // Services
  async getServices() {
    return this.request('/services');
  }

  // Barbers
  async getBarbers() {
    return this.request('/barbers');
  }

  // Bookings
  async getBookings(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/bookings?${params}`);
  }

  // CREATE Booking - MÉTODO CRÍTICO
  async createBooking(bookingData) {
    console.log('📝 Enviando datos de reserva:', bookingData);
    return this.request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  }

  // Update booking status
  async updateBookingStatus(bookingId, status) {
    return this.request(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: { status },
    });
  }

  // Delete booking
  async deleteBooking(bookingId) {
    return this.request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
