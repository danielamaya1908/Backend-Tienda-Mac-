const fs = require("fs").promises;
const { Image } = require("../db"); 

const deleteImagesByNames = async (imageNames) => {
  try {
    const totalImages = imageNames.length;

    for (let i = 0; i < totalImages; i++) {
      const imageName = imageNames[i];
      try {
        // Eliminar la imagen de la base de datos
        await Image.destroy({
          where: {
            path: imageName // Asumiendo que "path" es el campo que contiene el nombre de la imagen
          }
        });
        console.log(`Eliminada la imagen con nombre ${imageName} de la base de datos`);
      } catch (error) {
        console.error(`Error al eliminar la imagen con nombre ${imageName}:`, error.message);
      }
    }

    console.log("Eliminación completada con éxito");
  } catch (error) {
    console.error("Error durante la eliminación:", error);
  }
};

// Lista de nombres de imágenes a eliminar
const imagesToDelete = [
  "MYEC3BE-A_1.jpg",
  "MYEC3BE-A_2.jpg",
  "MYEC3BE-A_3.jpg",
  // ...añade todos los nombres de las imágenes que quieras eliminar
];

// Importar la función de eliminación
const deleteImages = require('./scripts/deleteImages'); // Asegúrate de que la ruta sea correcta

const app = express();
const router = express.Router(); // Inicializa el router

app.name = "API";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));

// Ejecutar la eliminación al iniciar la aplicación
deleteImagesByNames(imagesToDelete); // Llama a la función de eliminación
