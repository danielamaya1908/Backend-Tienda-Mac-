require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routes/auth');
const postExcelProducts = require('./controllers/product/postExcelProducts');
const openpayRoutes = require('./routes/openpay'); // Importa las rutas de Openpay
const soporteTecnicoRoutes = require('./routes/soporteTecnico.routes');
require('./db');

const app = express();
app.name = 'API';

// Configuración de middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Configuración de rutas
app.use('/auth', authRoutes);
app.use('/api/openpay', openpayRoutes);
app.use('/soporte-tecnico', soporteTecnicoRoutes); 

// Configuración de CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Configuración de archivos estáticos
app.use('/uploads', express.static('src/uploads'));
// Servir archivos estáticos desde el directorio 'uploads'
app.use('/images', express.static('C:\\Users\\USER\\OneDrive\\Escritorio\\Tienda-Mac\\ImagesProducts')); // Servir archivos estáticos desde 'ImagesProducts'

// Configuración de multer
const upload = multer({ dest: 'uploads/' });

app.post('/postExcelProducts', upload.single('file'), (req, res, next) => {
  console.log('Archivo recibido:', req.file);
  console.log('Cuerpo de la solicitud:', req.body);
  next();
}, postExcelProducts);

const routes = require('./routes/app.routes');
app.use('/', routes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
