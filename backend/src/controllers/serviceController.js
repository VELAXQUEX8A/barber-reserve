import { Service } from '../models/Service.js';

export const serviceController = {
  // Obtener todos los servicios
  async getServices(req, res) {
    try {
      console.log('📦 Obteniendo servicios desde la base de datos...');
      const services = await Service.findAll();
      
      console.log(`✅ Servicios encontrados: ${services.length}`);
      
      res.json({
        success: true,
        data: services,
        count: services.length
      });
    } catch (error) {
      console.error('❌ Error en serviceController:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener servicios: ' + error.message
      });
    }
  }
};
