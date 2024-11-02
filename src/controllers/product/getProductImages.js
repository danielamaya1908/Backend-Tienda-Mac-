const { ImageProduct } = require("../../db");

const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await ImageProduct.findAll({
      where: { productId },
      attributes: ['id'], // Solo necesitamos el ID para identificar las imágenes
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the product" });
    }

    // Aquí no tenemos la ruta del archivo, pero podemos devolver los IDs de las imágenes
    const imageIds = images.map(image => image.id);

    res.status(200).json(imageIds);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;
