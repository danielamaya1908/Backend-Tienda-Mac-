const express = require('express');
const router = express.Router();
const { 
  updateSoporteTecnico, 
  updateEstadoSoporteTecnico, 
  getAllSoportesTecnicos, 
  searchSoportesTecnicos,  
  getSoporteTecnicoById,
  getClienteByDocumentNumber
} = require('../controllers/SoporteTecnico/SoporteTecnico');
/* const { 
  authenticateToken, 
  getClienteSoportesTecnicos, 
  getClienteSoporteTecnicoDetail 
} = require('../controllers/SoporteTecnico/SoporteTecnicoClient'); */
const { 
  postTechnicalSupport, 
  uploadMiddleware 
} = require('../controllers/SoporteTecnico/postTechnicalSupport');

// Ruta para crear un nuevo soporte técnico
router.post('/', uploadMiddleware, postTechnicalSupport);

// Ruta para actualizar un soporte técnico existente
router.put('/:id', updateSoporteTecnico);

// Ruta para actualizar el estado de un soporte técnico
router.put('/:id/estado', updateEstadoSoporteTecnico);

// Ruta para obtener todos los soportes técnicos
router.get('/', getAllSoportesTecnicos);

// Ruta para buscar soportes técnicos
router.get('/search', searchSoportesTecnicos);

// Ruta para obtener un soporte técnico por ID
router.get('/:id', getSoporteTecnicoById);

router.get('/cliente/:documentNumber', getClienteByDocumentNumber);
/* // Ruta para obtener soportes técnicos del cliente (requiere autenticación)
router.get('/soportetecnicocliente', authenticateToken, getClienteSoportesTecnicos);

// Ruta para obtener detalles de un soporte técnico del cliente (requiere autenticación)
router.get('/soportetecnicocliente/:id', authenticateToken, getClienteSoporteTecnicoDetail);

 */

module.exports = router;
