const { Product } = require("../../db");

const getSubcategory = async (req, res) => {
  try {
    const products = await Product.findAll();

    const subCategories = [...new Set(products.map((product) => product.subCategory))];

    res.json({ subCategories });
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = getSubcategory;
