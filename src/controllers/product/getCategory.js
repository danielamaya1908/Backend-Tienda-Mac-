const { Product } = require("../../db");

const getCategory = async (req, res) => {
  try {
    const products = await Product.findAll();

    const categories = [...new Set(products.map((product) => product.category))];

    res.json({ categories });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = getCategory;
