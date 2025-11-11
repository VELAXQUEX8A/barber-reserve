import { Barber } from '../models/Barber.js';

export const barberController = {
  // Obtener todos los barberos
  async getBarbers(req, res) {
    try {
      console.log('💈 Obteniendo barberos desde la base de datos...');
      const barbers = await Barber.findAll();
      
      console.log(`✅ Barberos encontrados: ${barbers.length}`);
      
      res.json({
        success: true,
        data: barbers,
        count: barbers.length
      });
    } catch (error) {
      console.error('❌ Error en barberController:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener barberos: ' + error.message
      });
    }
  }
};
