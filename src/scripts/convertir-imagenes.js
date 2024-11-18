const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Ruta de la carpeta donde están las imágenes .png
const directoryPath =
  "C:/Users/USER/OneDrive/Escritorio/Backend-Tienda-Mac-/IMAGENES DE IPHONE 16";

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("No se pudo listar los archivos:", err);
    return;
  }

  // Itera sobre los archivos de la carpeta
  files.forEach((file) => {
    if (path.extname(file).toLowerCase() === ".png") {
      const inputPath = path.join(directoryPath, file);
      const outputPath = path.join(
        directoryPath,
        path.basename(file, ".png") + ".webp"
      );

      // Convertir la imagen de .png a .webp
      sharp(inputPath)
        .webp() // Configura para convertir a .webp
        .toFile(outputPath, (err, info) => {
          if (err) {
            console.error("Error al convertir la imagen:", err);
          } else {
            console.log(`Convertido: ${file} -> ${info.format}`);

            // Eliminar la imagen .png original después de la conversión
            fs.unlink(inputPath, (err) => {
              if (err) {
                console.error(`No se pudo eliminar la imagen ${file}:`, err);
              } else {
                console.log(`Imagen eliminada: ${file}`);
              }
            });
          }
        });
    }
  });
});
