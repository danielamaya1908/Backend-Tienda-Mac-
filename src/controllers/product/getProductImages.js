const { ImageProduct } = require("../../db");

const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await ImageProduct.findAll({
      where: { productId },
      attributes: ['id', 'path'], // Incluimos 'path' para obtener la ruta de las imágenes
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the product" });
    }

    // Devolvemos las rutas de las imágenes
    const imagePaths = images.map(image => image.path);

    res.status(200).json(imagePaths);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;
