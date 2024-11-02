const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fetch = require("node-fetch"); // Importar node-fetch para el proxy

const postExcelProducts = require("./controllers/product/postExcelProducts.js");
const updateProductQuantity = require("./controllers/product/updateProductQuantity.js");
const authRoutes = require('./routes/auth.js');
const openpayRoutes = require('./routes/openpay');
const soporteTecnicoRoutes = require('./routes/soporteTecnico.routes');

const app = express();
const router = express.Router(); // Inicializa el router

app.name = "API";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Usa el router para definir la ruta
router.post('/update-quantity', updateProductQuantity);
app.use(router);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Configuración de archivos estáticos
const imagesPath = path.join(__dirname, 'images'); // Asegúrate de que esta ruta sea correcta
app.use('/images', express.static(imagesPath));

// Ruta para la subida de imágenes
const upload = multer({ dest: "uploads/" });

app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("Archivo recibido:", req.file);
  res.status(200).send("Imagen subida con éxito.");
});

// Ruta del proxy para las imágenes
app.get('/proxy/image/:imageName', async (req, res) => {
  const imageName = req.params.imageName;
  const rawUrl = `https://raw.githubusercontent.com/tu_usuario/tu_repositorio/main/src/ImagesProducts/${imageName}`;

  try {
    const response = await fetch(rawUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}` // Usa el token de acceso personal
      }
    });

    if (!response.ok) throw new Error('Error fetching image');
    const imageBuffer = await response.buffer();
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(imageBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error loading image');
  }
});

// Rutas de autenticación y otros servicios
app.use('/auth', authRoutes);
app.post("/postExcelProducts", upload.single("file"), (req, res, next) => {
  console.log("Archivo recibido:", req.file);
  console.log("Cuerpo de la solicitud:", req.body);
  next();
}, postExcelProducts);

const routes = require("./routes/app.routes.js");
app.use("/", routes);
app.use('/api/openpay', openpayRoutes); // Usa las rutas de Openpay
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
