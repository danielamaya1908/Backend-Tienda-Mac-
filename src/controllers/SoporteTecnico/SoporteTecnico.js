const {
  User,
  SoporteTecnico,
  ImageSoporteTecnico,
  ImageEstado,
} = require("../../db");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

// Función para actualizar soporte técnico
const updateSoporteTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      marca,
      modelo,
      serial,
      codigo,
      userId,
      garantia,
      enciende,
      arranca,
      parlantes,
      teclado,
      camara,
      bluetooth,
      wifi,
      pinCarga,
      auricular,
      botones,
      pantalla,
      golpes,
      rayones,
      puertos,
      estado,
      diagnosticoDescripcion,
    } = req.body;

    const soporteTecnico = await SoporteTecnico.findByPk(id);
    if (!soporteTecnico) {
      return res.status(404).json({ error: "Soporte técnico no encontrado" });
    }

    await soporteTecnico.update({
      marca,
      modelo,
      serial,
      codigo,
      userId,
      garantia,
      enciende,
      arranca,
      parlantes,
      teclado,
      camara,
      bluetooth,
      wifi,
      pinCarga,
      auricular,
      botones,
      pantalla,
      golpes,
      rayones,
      puertos,
      estado,
      diagnosticoDescripcion,
    });

    return res.status(200).json(soporteTecnico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para actualizar el estado del soporte técnico
const updateEstadoSoporteTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, diagnosticoDescripcion } = req.body;

    const soporteTecnico = await SoporteTecnico.findByPk(id);
    if (!soporteTecnico) {
      return res.status(404).json({ error: "Soporte técnico no encontrado" });
    }

    // Actualizar el estado
    soporteTecnico.estado = estado;

    // Actualizar la descripción tanto para Diagnosticando como Entregado
    if (diagnosticoDescripcion) {
      soporteTecnico.diagnosticoDescripcion = diagnosticoDescripcion;
    }

    // Actualizar la fecha de salida si el estado es "Entregado"
    if (estado === "Entregado") {
      soporteTecnico.fechaSalida = new Date();
    } else {
      soporteTecnico.fechaSalida = null;
    }

    // Guardar los cambios
    await soporteTecnico.save();

    return res.status(200).json(soporteTecnico);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getAllSoportesTecnicos = async (req, res) => {
  try {
    const soportesTecnicos = await SoporteTecnico.findAll({
      attributes: [
        "id",
        "marca",
        "modelo",
        "serial",
        "codigo",
        "userId",
        "garantia",
        "enciende",
        "arranca",
        "parlantes",
        "teclado",
        "camara",
        "bluetooth",
        "wifi",
        "pinCarga",
        "auricular",
        "botones",
        "pantalla",
        "golpes",
        "rayones",
        "puertos",
        "estado",
        "createdAt",
        "fechaIngreso",
        "fechaSalida",
        "diagnosticoDescripcion",
      ],
      include: [
        {
          model: User,
          attributes: [
            "id",
            "documentNumber",
            "externalSignIn",
            "active",
            "sendMailsActive",
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
            "city",
            "country",
            "zipCode",
            "email",
            "password",
            "rol",
            "image",
          ],
        },
        {
          model: ImageSoporteTecnico,
          attributes: ["url"],
        },
      ],
    });

    res.json(soportesTecnicos);
  } catch (error) {
    console.error("Error al obtener soportes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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

    if (estado && estado !== "Todos los Estados") {
      whereConditions.estado = estado.toLowerCase();
    }

    const soportesTecnicos = await SoporteTecnico.findAll({
      where: whereConditions,
      attributes: [
        "id",
        "marca",
        "modelo",
        "serial",
        "codigo",
        "userId",
        "estado",
        "createdAt",
        "fechaIngreso",
        "fechaSalida",
        "diagnosticoDescripcion",
      ],
      include: [
        {
          model: User,
          attributes: [
            "id",
            "documentNumber",
            "externalSignIn",
            "active",
            "sendMailsActive",
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
            "city",
            "country",
            "zipCode",
            "email",
            "password",
            "rol",
            "image",
          ],
        },
        {
          model: ImageSoporteTecnico,
          attributes: ["url"],
        },
      ],
    });

    res.json(soportesTecnicos);
  } catch (error) {
    console.error("Error al buscar soportes técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getSoporteTecnicoById = async (req, res) => {
  try {
    const { id } = req.params;

    const soporteTecnico = await SoporteTecnico.findByPk(id, {
      attributes: [
        "id",
        "marca",
        "modelo",
        "serial",
        "codigo",
        "userId",
        "garantia",
        "enciende",
        "arranca",
        "parlantes",
        "teclado",
        "camara",
        "bluetooth",
        "wifi",
        "pinCarga",
        "auricular",
        "botones",
        "pantalla",
        "golpes",
        "rayones",
        "puertos",
        "estado",
        "createdAt",
        "fechaIngreso",
        "fechaSalida",
        "diagnosticoDescripcion",
      ],
      include: [
        {
          model: User,
          attributes: [
            "id",
            "documentNumber",
            "externalSignIn",
            "active",
            "sendMailsActive",
            "firstName",
            "lastName",
            "phoneNumber",
            "address",
            "city",
            "country",
            "zipCode",
            "email",
            "password",
            "rol",
            "image",
          ],
        },
        {
          model: ImageSoporteTecnico,
          attributes: ["url"],
        },
      ],
    });

    if (!soporteTecnico) {
      return res.status(404).json({ error: "Soporte técnico no encontrado" });
    }

    res.json(soporteTecnico);
  } catch (error) {
    console.error("Error al obtener soporte técnico por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getClienteByDocumentNumber = async (req, res) => {
  try {
    const { documentNumber } = req.params;
    const cliente = await User.findOne({
      where: { documentNumber },
      attributes: ["id", "firstName", "lastName"],
    });

    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(cliente);
  } catch (error) {
    console.error("Error al obtener cliente por número de documento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para subir imagen de soporte técnico
const uploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No se ha subido ninguna imagen" });
    }

    const soporteTecnico = await SoporteTecnico.findByPk(id);
    if (!soporteTecnico) {
      return res.status(404).json({ error: "Soporte técnico no encontrado" });
    }

    const imagen = await ImageEstado.create({
      url: `/uploads/${file.filename}`,
      soporteTecnicoId: id,
    });

    return res.status(200).json(imagen);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al subir la imagen" });
  }
};

// Nueva función para obtener la imagen más reciente según el estado
const getImagesWithStates = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el soporte técnico por su ID
    const soporteTecnico = await SoporteTecnico.findByPk(id, {
      attributes: ["id", "estado", "diagnosticoDescripcion"], // Incluimos diagnosticoDescripcion
      include: [
        {
          model: ImageEstado,
          as: "ImageEstados",
          attributes: ["id", "url", "createdAt"],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!soporteTecnico) {
      return res.status(404).json({ error: "Soporte técnico no encontrado" });
    }

    if (
      !soporteTecnico.ImageEstados ||
      soporteTecnico.ImageEstados.length === 0
    ) {
      return res.status(404).json({
        error: "No se encontraron imágenes para este soporte técnico",
      });
    }

    const imagenesConEstados = soporteTecnico.ImageEstados.map((imagen) => ({
      id: imagen.id,
      url: imagen.url,
      estado: soporteTecnico.estado,
      fechaSubida: imagen.createdAt,
    }));

    res.json({
      id: soporteTecnico.id,
      estadoActual: soporteTecnico.estado,
      diagnosticoDescripcion: soporteTecnico.diagnosticoDescripcion,
      imagenes: imagenesConEstados,
    });
  } catch (error) {
    console.error("Error al obtener las imágenes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  updateSoporteTecnico,
  updateEstadoSoporteTecnico,
  getAllSoportesTecnicos,
  searchSoportesTecnicos,
  getSoporteTecnicoById,
  getClienteByDocumentNumber,
  uploadImage,
  upload,
  getImagesWithStates,
};
