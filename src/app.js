const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const postExcelImages = require("./controllers/product/postExcelImages.js");
require("./db.js");

const app = express();
app.name = "API";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, "uploads/excels"); // Carpeta para los archivos Excel
    } else {
      cb(null, path.join(__dirname, 'src', 'ImagesProducts')); // Carpeta para las imágenes
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Mantén el nombre original del archivo
  },
});

const upload = multer({ storage: storage });

// Ruta para servir imágenes estáticas
const imagesPath = path.join(__dirname, 'src', 'ImagesProducts');
app.use('/images', express.static(imagesPath));

// Ruta para cargar el archivo Excel y las imágenes
app.post("/uploadExcelAndImages", upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), postExcelImages);

const routes = require("./routes/app.routes.js");
app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
