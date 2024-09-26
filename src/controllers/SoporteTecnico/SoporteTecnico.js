// Backend - controllers/soporteTecnico.js

const { User, SoporteTecnico, ImageSoporteTecnico } = require('../../db');
const { Op } = require('sequelize');

// Función para actualizar soporte técnico
const updateSoporteTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      marca, modelo, serial, userId, garantia, enciende, arranca, parlantes, teclado,
      camara, bluetooth, wifi, pinCarga, auricular, botones, pantalla, golpes, rayones,
      puertos, estado
    } = req.body;

    const soporteTecnico = await SoporteTecnico.findByPk(id);
    if (!soporteTecnico) {
      return res.status(404).json({ error: 'Soporte técnico no encontrado' });
    }

    await soporteTecnico.update({
      marca, modelo, serial, userId, garantia, enciende, arranca, parlantes, teclado,
      camara, bluetooth, wifi, pinCarga, auricular, botones, pantalla, golpes, rayones,
      puertos, estado
    });

    return res.status(200).json(soporteTecnico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para actualizar el estado del soporte técnico
const updateEstadoSoporteTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const soporteTecnico = await SoporteTecnico.findByPk(id);
    if (!soporteTecnico) {
      return res.status(404).json({ error: 'Soporte técnico no encontrado' });
    }

    // Actualizar el estado
    soporteTecnico.estado = estado;

    // Si el estado es "Entregado", establecer la fecha de salida
    if (estado === 'Entregado') {
      soporteTecnico.fechaSalida = new Date(); // Establece la fecha de salida actual
    } else {
      // Si el estado no es "Entregado", puedes asegurarte de que fechaSalida esté en null o vacía
      soporteTecnico.fechaSalida = null;
    }

    await soporteTecnico.save();

    return res.status(200).json(soporteTecnico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getAllSoportesTecnicos = async (req, res) => {
  try {
    const soportesTecnicos = await SoporteTecnico.findAll({
      attributes: [
        'id', 'marca', 'modelo', 'serial', 'userId', 'garantia', 'enciende', 'arranca', 
        'parlantes', 'teclado', 'camara', 'bluetooth', 'wifi', 'pinCarga', 'auricular', 
        'botones', 'pantalla', 'golpes', 'rayones', 'puertos', 'estado', 'createdAt', 'fechaIngreso', 'fechaSalida'
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'documentNumber', 'externalSignIn', 'active', 'sendMailsActive', 
                       'firstName', 'lastName', 'phoneNumber', 'address', 'city', 'country', 
                       'zipCode', 'email', 'password', 'rol', 'image']
        },
        {
          model: ImageSoporteTecnico,
          attributes: ['url'],
        }
      ],
    });

    res.json(soportesTecnicos);
  } catch (error) {
    console.error('Error al obtener soportes técnicos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const searchSoportesTecnicos = async (req, res) => {
  try {
    const { id, nombre, fecha, serial, estado } = req.query;

    const whereConditions = {};

    if (id) {
      whereConditions.id = id;
    }

    if (nombre) {
      whereConditions.modelo = { [Op.iLike]: `%${nombre}%` };
    }

    if (fecha) {
      whereConditions.createdAt = { [Op.gte]: new Date(fecha) };
    }

    if (serial) {
      whereConditions.serial = { [Op.iLike]: `%${serial}%` };
    }

    if (estado && estado !== 'Todos los Estados') {
      whereConditions.estado = estado.toLowerCase();
    }

    const soportesTecnicos = await SoporteTecnico.findAll({
      where: whereConditions,
      attributes: [
        'id', 'marca', 'modelo', 'serial', 'userId', 'estado', 'createdAt', 'fechaIngreso', 'fechaSalida'
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'documentNumber', 'externalSignIn', 'active', 'sendMailsActive', 
                       'firstName', 'lastName', 'phoneNumber', 'address', 'city', 'country', 
                       'zipCode', 'email', 'password', 'rol', 'image']
        },
        {
          model: ImageSoporteTecnico,
          attributes: ['url'],
        }
      ],
    });

    res.json(soportesTecnicos);
  } catch (error) {
    console.error('Error al buscar soportes técnicos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getSoporteTecnicoById = async (req, res) => {
  try {
    const { id } = req.params;

    const soporteTecnico = await SoporteTecnico.findByPk(id, {
      attributes: [
        'id', 'marca', 'modelo', 'serial', 'userId', 'garantia', 'enciende', 'arranca', 
        'parlantes', 'teclado', 'camara', 'bluetooth', 'wifi', 'pinCarga', 'auricular', 
        'botones', 'pantalla', 'golpes', 'rayones', 'puertos', 'estado', 'createdAt', 'fechaIngreso', 'fechaSalida'
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'documentNumber', 'externalSignIn', 'active', 'sendMailsActive', 
                       'firstName', 'lastName', 'phoneNumber', 'address', 'city', 'country', 
                       'zipCode', 'email', 'password', 'rol', 'image']
        },
        {
          model: ImageSoporteTecnico,
          attributes: ['url'],
        }
      ],
    });

    if (!soporteTecnico) {
      return res.status(404).json({ error: 'Soporte técnico no encontrado' });
    }

    res.json(soporteTecnico);
  } catch (error) {
    console.error('Error al obtener soporte técnico por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


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
  updateSoporteTecnico,
  updateEstadoSoporteTecnico,
  getAllSoportesTecnicos,
  searchSoportesTecnicos,
  getSoporteTecnicoById,
  getClienteByDocumentNumber
};