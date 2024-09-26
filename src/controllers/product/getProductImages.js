const { Image } = require("../../db");

const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    // Obtener todas las imágenes asociadas con el producto
    const images = await Image.findAll({
      where: { productId },
      attributes: ['id', 'path'],
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the product" });
    }

    // Extraer solo los nombres de archivos de las rutas completas
    const imagePaths = images.map(image => {
      // Asumiendo que `image.path` contiene la ruta completa
      const fileName = image.path.split('\\').pop(); // Usar `split('\\')` para Windows
      return fileName;
    });

    // Responder con los nombres de archivos
    res.status(200).json(imagePaths);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;
