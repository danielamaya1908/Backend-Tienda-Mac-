const { ImageProduct } = require("../../db");

const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await ImageProduct.findAll({
      where: { productId },
      attributes: ['id', 'imageData'], // Asegúrate de incluir 'imageData'
    });

    if (!images || images.length === 0) {
      return res.status(404).json({ message: "No images found for the product" });
    }

    // Convertir los datos binarios a base64
    const base64Images = images.map(image => ({
      id: image.id,
      data: image.imageData.toString('base64'), // Convertimos a base64
    }));

    res.status(200).json(base64Images);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;
