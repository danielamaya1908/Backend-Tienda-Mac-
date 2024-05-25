const { Image } = require("../../db");
const path = require("path");

const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await Image.findAll({
      where: { productId },
      attributes: ['id', 'path'],
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the product" });
    }

    // Construir la URL completa para cada imagen
    const imagePaths = images.map(image => {
      // Utiliza la ruta base de la imagen en el servidor
      const basePath = '/images/';
      // Obtiene el nombre del archivo de la ruta completa
      const fileName = path.basename(image.path);
      // Retorna la URL completa de la imagen
      return basePath + fileName;
    });

    res.status(200).json(imagePaths);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;
