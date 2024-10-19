const { User, SoporteTecnico, ImageSoporteTecnico } = require("../../db");
const jwt = require('jsonwebtoken');

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'No se proporcionó token de autenticación' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado' });
    req.user = decoded.user;
    next();
  });
};

// Obtener soportes técnicos del cliente
const getClienteSoportesTecnicos = async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('User:', req.user);

  try {
    if (!req.user || !req.user.id) {
      console.error('Error: req.user o req.user.id es undefined');
      return res.status(400).json({ error: 'Información de usuario no disponible' });
    }

    const userId = req.user.id;
    console.log('userId:', userId);

    const soportesTecnicos = await SoporteTecnico.findAll({
      where: { userId: userId },
      attributes: [
        'id', 'marca', 'modelo', 'serial', 'estado', 'createdAt', 'fechaIngreso', 'fechaSalida', 'diagnosticoDescripcion' // Agregamos diagnosticoDescripcion
      ],
      include: [
        {
          model: ImageSoporteTecnico,
          attributes: ['url'], // Incluye solo el campo 'url' para las imágenes
        },
        {
          model: User,
          attributes: [
            'id', 'firstName', 'lastName', 'documentNumber', 'phoneNumber', 'address', 
            'city', 'country', 'zipCode', 'email'
          ] // Incluye los campos del usuario
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(soportesTecnicos);
  } catch (error) {
    console.error('Error al obtener soportes técnicos del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

// Obtener detalles de un soporte técnico específico
const getClienteSoporteTecnicoDetail = async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('User:', req.user);

  try {
    if (!req.user || !req.user.id) {
      console.error('Error: req.user o req.user.id es undefined');
      return res.status(400).json({ error: 'Información de usuario no disponible' });
    }

    const { id } = req.params;
    const userId = req.user.id;
    console.log('userId:', userId, 'soporteId:', id);

    const soporteTecnico = await SoporteTecnico.findOne({
      where: { id: id, userId: userId },
      attributes: [
        'id', 'marca', 'modelo', 'serial', 'userId', 'garantia', 'enciende', 'arranca', 
        'parlantes', 'teclado', 'camara', 'bluetooth', 'wifi', 'pinCarga', 'auricular', 
        'botones', 'pantalla', 'golpes', 'rayones', 'puertos', 'estado', 'createdAt', 
        'fechaIngreso', 'fechaSalida', 'diagnosticoDescripcion' // Agregamos diagnosticoDescripcion
      ],
      include: [
        {
          model: ImageSoporteTecnico,
          attributes: ['url'], // Incluye solo el campo 'url' para las imágenes
        },
        {
          model: User,
          attributes: [
            'id', 'firstName', 'lastName', 'documentNumber', 'phoneNumber', 'address', 
            'city', 'country', 'zipCode', 'email'
          ] // Incluye los campos del usuario
        }
      ]
    });

    if (!soporteTecnico) {
      return res.status(404).json({ error: 'Soporte técnico no encontrado o no pertenece al usuario' });
    }

    res.json(soporteTecnico);
  } catch (error) {
    console.error('Error al obtener detalles del soporte técnico:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};

// Obtener cliente por número de documento
const getClienteByDocumentNumber = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const cliente = await User.findOne({
      where: { documentNumber },
      attributes: ['id', 'firstName', 'lastName']
    });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente por número de documento:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  authenticateToken,
  getClienteSoportesTecnicos,
  getClienteSoporteTecnicoDetail,
  getClienteByDocumentNumber
};
