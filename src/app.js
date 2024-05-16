const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");

const postExcelProducts = require("./controllers/product/postExcelProducts.js");
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

app.use('/images', express.static('C:\\Users\\USER\\OneDrive\\Escritorio\\Tienda-Mac\\ImagesProducts'));

const upload = multer({ dest: "uploads/" });

app.post("/postExcelProducts", upload.single("file"), (req, res, next) => {
  console.log("Archivo recibido:", req.file);
  console.log("Cuerpo de la solicitud:", req.body);
  next();
}, postExcelProducts);

const routes = require("./routes/app.routes.js");
app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;