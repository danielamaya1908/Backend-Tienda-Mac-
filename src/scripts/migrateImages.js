const fs = require("fs").promises; // Asegúrate de importar fs para trabajar con archivos
const { ImageProduct, Image } = require("../db"); // Asegúrate de que la ruta sea correcta

const migrateImages = async () => {
  try {
    // Obtiene todas las imágenes de la tabla `images`
    const oldImages = await Image.findAll();

    for (const oldImage of oldImages) {
      // Lee la imagen como un Buffer
      const imageData = await fs.readFile(oldImage.path);

      // Crea la nueva entrada en la tabla `ImageProduct`
      await ImageProduct.create({
        imageData,       // Almacena los bytes de la imagen
        productId: oldImage.productId,
        itemId: oldImage.itemId,
      });

      console.log(`Migrated image with id ${oldImage.id} to ImageProduct`);
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

module.exports = migrateImages;
