const { Op } = require("sequelize");
const { Product, Category, Brand, Colors, Capacities, Subcategories, Condition } = require("../../db");

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query; // Campo de búsqueda unificado

    // Si no se proporciona un parámetro de consulta, retorna todos los productos
    if (!query) {
      return res.status(400).json({ message: "Please provide a search query" });
    }

    // Construir una búsqueda dinámica que incluya múltiples relaciones
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } }, // Búsqueda por nombre de producto
        ]
      },
      include: [
        { model: Category, where: { name: { [Op.iLike]: `%${query}%` } }, required: false }, // Búsqueda por nombre de categoría
        { model: Brand, where: { name: { [Op.iLike]: `%${query}%` } }, required: false },    // Búsqueda por nombre de marca
        { model: Colors, where: { name: { [Op.iLike]: `%${query}%` } }, required: false },   // Búsqueda por color
        { model: Capacities, where: { name: { [Op.iLike]: `%${query}%` } }, required: false }, // Búsqueda por capacidad
        { model: Subcategories, where: { name: { [Op.iLike]: `%${query}%` } }, required: false }, // Búsqueda por subcategoría
        { model: Condition, where: { name: { [Op.iLike]: `%${query}%` } }, required: false },  // Búsqueda por condición del producto
      ]
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ message: "Error searching for products" });
  }
};

module.exports = searchProducts;
