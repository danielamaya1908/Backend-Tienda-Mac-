const { Op } = require("sequelize");
const { Product, Category, Brand, Colors, Capacities, Subcategories, Condition } = require("../../db");

const searchProducts = async (req, res) => {
  try {
    const { name, itemId, categoryId, brandId, colorId, capacityId, subcategoryId, conditionId } = req.query;

    // Construir el objeto de consulta dinámicamente
    const query = {};
    if (name) {
      query.name = { [Op.iLike]: `%${name}%` }; // Uso de iLike para búsqueda insensible a mayúsculas/minúsculas
    }
    if (itemId) {
      query.itemId = itemId;
    }
    if (categoryId) {
      query.categoryId = categoryId;
    }
    if (brandId) {
      query.brandId = brandId;
    }
    if (colorId) {
      query.colorId = colorId;
    }
    if (capacityId) {
      query.capacityId = capacityId;
    }
    if (subcategoryId) {
      query.subcategoryId = subcategoryId;
    }
    if (conditionId) {
      query.conditionId = conditionId;
    }

    // Depuración: Imprimir la consulta construida
    console.log("Query:", query);

    // Realizar la búsqueda en la base de datos
    const products = await Product.findAll({
      where: query,
      include: [
        { model: Category },
        { model: Brand },
        { model: Colors },
        { model: Capacities },
        { model: Subcategories },
        { model: Condition }
      ]
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Depuración: Imprimir productos encontrados
    console.log("Products found:", products.map(product => product.toJSON()));

    res.status(200).json(products);
  } catch (error) {
    console.error("Error searching for products:", error);
    res.status(500).json({ message: "Error searching for products" });
  }
};

module.exports = searchProducts;
