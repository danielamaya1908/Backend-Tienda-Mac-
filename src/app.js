const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
const postExcelProducts = require("./controllers/product/postExcelProducts.js");
require("./db.js");
const authRoutes = require('./routes/auth.js');
const openpayRoutes = require('./routes/openpay');
const updateProductQuantity = require('./controllers/product/updateProductQuantity.js');
const soporteTecnicoRoutes = require('./routes/soporteTecnico.routes');

const app = express();
const router = express.Router();

// Definir la ruta del volumen de Railway
const RAILWAY_VOLUME_PATH = process.env.RAILWAY_VOLUME_MOUNT_PATH || '/opt/app/images';

// Asegurarse de que el directorio existe
if (!fs.existsSync(RAILWAY_VOLUME_PATH)) {
  fs.mkdirSync(RAILWAY_VOLUME_PATH, { recursive: true });
}

// Configurar multer para almacenar archivos en el volumen
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, RAILWAY_VOLUME_PATH)
  },
  filename: function (req, file, cb) {
    // Mantener el nombre original del archivo
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage });

app.name = "API";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

router.post('/update-quantity', updateProductQuantity);
app.use(router);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Servir archivos estáticos desde el volumen de Railway
app.use('/images', express.static(RAILWAY_VOLUME_PATH));

// Ruta para subir imágenes
app.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
  }
  
  const imageUrl = `/images/${req.file.filename}`;
  res.json({ 
    message: 'Imagen subida exitosamente',
    imageUrl: imageUrl
  });
});

// Ruta para listar imágenes disponibles
app.get('/images-list', (req, res) => {
  fs.readdir(RAILWAY_VOLUME_PATH, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el directorio de imágenes' });
    }
    
    const imageUrls = files.map(file => `/images/${file}`);
    res.json({ images: imageUrls });
  });
});

app.use('/auth', authRoutes);

app.post("/postExcelProducts", upload.single("file"), (req, res, next) => {
  console.log("Archivo recibido:", req.file);
  console.log("Cuerpo de la solicitud:", req.body);
  next();
}, postExcelProducts);

const routes = require("./routes/app.routes.js");
app.use("/", routes);
app.use('/api/openpay', openpayRoutes);
app.use('/soporte-tecnico', soporteTecnicoRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    msg: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

module.exports = app;