const fs = require("fs").promises;
const { ImageProduct } = require("../db");
const sharp = require("sharp");

const convertImagesToWebP = async () => {
  try {
    const images = await ImageProduct.findAll();

    for (const image of images) {
      try {
        const imageData = await fs.readFile(image.path);
        const webpData = await sharp(imageData).webp().toBuffer();
        await ImageProduct.update(
          { imageData: webpData },
          { where: { id: image.id } }
        );
        console.log(
          `Imagen con ID ${image.id} convertida a WebP exitosamente.`
        );
      } catch (error) {
        console.error(
          `Error al convertir imagen con ID ${image.id} a WebP:`,
          error.message
        );
      }
    }

    console.log("Conversión de imágenes a WebP completada.");
  } catch (error) {
    console.error("Error durante la conversión de imágenes:", error);
  }
};

module.exports = convertImagesToWebP;
