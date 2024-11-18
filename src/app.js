const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const postExcelProducts = require("./controllers/product/postExcelProducts.js");
require("./db.js");
const authRoutes = require("./routes/auth.js");
const openpayRoutes = require("./routes/openpay"); // Importa las rutas de Openpay
const updateProductQuantity = require("./controllers/product/updateProductQuantity.js");
const soporteTecnicoRoutes = require("./routes/soporteTecnico.routes");
/* const convertImagesToWebP = require("./scripts/convertToWebP.js"); */
// Importar la función de migración
/* const migrateImages = require('./scripts/migrateImages'); // Asegúrate de que la ruta sea correcta */

const app = express();
const router = express.Router(); // Inicializa el router

app.name = "API";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Ejecutar la migración al iniciar la aplicación
/* migrateImages(); // Llama a la función de migración */
/* convertImagesToWebP(); */
// Usa el router para definir la ruta
router.post("/update-quantity", updateProductQuantity);
app.use(router);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

// Configuración de archivos estáticos
app.use("/uploads", express.static("src/uploads"));

// Ruta relativa para servir imágenes estáticas
const imagesPath = path.join(__dirname, "ImagesProducts");
app.use("/images", express.static(imagesPath));

const upload = multer({ dest: "uploads/" });

app.use("/auth", authRoutes);

app.post(
  "/postExcelProducts",
  upload.single("file"),
  (req, res, next) => {
    console.log("Archivo recibido:", req.file);
    console.log("Cuerpo de la solicitud:", req.body);
    next();
  },
  postExcelProducts
);

const routes = require("./routes/app.routes.js");
app.use("/", routes);
app.use("/api/openpay", openpayRoutes); // Usa las rutas de Openpay
app.use("/soporte-tecnico", soporteTecnicoRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    msg: "Error interno del servidor",
    error:
      process.env.NODE_ENV === "development" ? err.message : "Algo salió mal",
  });
});

module.exports = app;
