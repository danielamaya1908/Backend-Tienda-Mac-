const { User, SoporteTecnico, ImageSoporteTecnico } = require("../../db");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Configuración de multer para almacenar archivos en el servidor
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

// Middleware para manejar la subida de archivos
const uploadMiddleware = upload.array("images");

// Crear nuevo soporte técnico
const postTechnicalSupport = async (req, res) => {
  try {
    const {
      marca,
      modelo,
      serial,
      codigo,
      DocumentNumber,
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
      diagnosticoDescripcion, // Nuevo campo para la descripción
    } = req.body;

    // Verificar si se han subido archivos
    const files = req.files || [];
    console.log("Archivos subidos:", files);

    if (!marca || !modelo || !serial || !codigo || !DocumentNumber) {
      return res.status(400).json({
        error:
          "Marca, modelo, serial, DocumentNumber y codigo son campos requeridos",
      });
    }

    // Verificar si el documento existe
    const user = await User.findOne({
      where: { documentNumber: DocumentNumber },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Crear el soporte técnico asociado al documento
    const soporteTecnico = await SoporteTecnico.create({
      marca,
      modelo,
      serial,
      codigo,
      userId: user.id, // Utiliza el id del usuario encontrado
      garantia: garantia === "true",
      enciende: enciende === "true",
      arranca: arranca === "true",
      parlantes: parlantes === "true",
      teclado: teclado === "true",
      camara: camara === "true",
      bluetooth: bluetooth === "true",
      wifi: wifi === "true",
      pinCarga: pinCarga === "true",
      auricular: auricular === "true",
      botones: botones === "true",
      pantalla: pantalla === "true",
      golpes: golpes === "true",
      rayones: rayones === "true",
      puertos: puertos === "true",
      estado: estado || "Ingreso",
      diagnosticoDescripcion, // Agregar la descripción al crear
      fechaIngreso: new Date(), // Establece la fecha de ingreso como la fecha y hora actual
    });

    // Guardar información de las imágenes en la base de datos
    if (files.length > 0) {
      for (const file of files) {
        try {
          console.log("Guardando imagen en la BD:", file.filename);
          await ImageSoporteTecnico.create({
            url: `/uploads/${file.filename}`, // Ruta de la imagen almacenada
            soporteTecnicoId: soporteTecnico.id,
          });
        } catch (error) {
          console.error(
            "Error al guardar la imagen en la base de datos:",
            error
          );
        }
      }
    }

    return res.status(201).json({
      message: "Soporte técnico creado exitosamente",
      soporteTecnico,
    });
  } catch (error) {
    console.error(
      "Error al crear soporte técnico:",
      error.message,
      error.stack
    );
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  postTechnicalSupport,
  uploadMiddleware,
};
