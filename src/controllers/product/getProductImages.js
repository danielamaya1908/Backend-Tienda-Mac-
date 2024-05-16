const { Image } = require("../../db");

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

    const imagePaths = images.map(image => {
      // Obtener solo el nombre del archivo de la ruta completa
      const fileName = image.path.split('\\').pop();
      return fileName;
    });

    res.status(200).json(imagePaths);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;