const { ImageHome } = require("../../db");

const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    // Usar el modelo de la nueva tabla ImageHome
    const images = await ImageHome.findAll({
      where: { productId },
      attributes: ["id", "imageData"], // Asegúrate de que 'imageData' esté presente en tu tabla
    });

    if (!images || images.length === 0) {
      return res
        .status(404)
        .json({ message: "No images found for the product" });
    }

    // Convertir los datos binarios a base64
    const base64Images = images.map((image) => ({
      id: image.id,
      data: image.imageData.toString("base64"), // Convertimos los datos binarios a base64
    }));

    res.status(200).json(base64Images);
  } catch (error) {
    console.error("Error getting product images:", error);
    res.status(500).json({ message: "Error getting product images" });
  }
};

module.exports = getProductImages;
