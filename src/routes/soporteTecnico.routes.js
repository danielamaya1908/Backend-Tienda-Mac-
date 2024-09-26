const express = require('express');
const router = express.Router();
const { 
  updateSoporteTecnico, 
  updateEstadoSoporteTecnico, 
  getAllSoportesTecnicos, 
  searchSoportesTecnicos,  
  getSoporteTecnicoById,
  getClienteByDocumentNumber,
  uploadImage,
  upload,
  getImagesWithStates
} = require('../controllers/SoporteTecnico/SoporteTecnico');
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

// Ruta para subir una imagen de soporte técnico
router.post('/:id/subir-imagen', upload.single('imagen'), uploadImage);

// Ruta para obtener todos los soportes técnicos
router.get('/', getAllSoportesTecnicos);

// Ruta para buscar soportes técnicos
router.get('/search', searchSoportesTecnicos);

// Ruta para obtener un soporte técnico por ID
router.get('/:id', getSoporteTecnicoById);

// Ruta para obtener un cliente por número de documento
router.get('/cliente/:documentNumber', getClienteByDocumentNumber);

// Nueva ruta para obtener la imagen más reciente
router.get('/:id/latest-image', getImagesWithStates);

module.exports = router;