const { Op } = require("sequelize");
const { Product, Image, Stock, Capacities } = require("../../db");

const applySorting = async (sortBy) => {
  try {
    let orderCriteria = [];

    switch (sortBy) {
      case "price_asc":
        orderCriteria = [["price", "ASC"]];
        break;
      case "price_desc":
        orderCriteria = [["price", "DESC"]];
        break;
      case "name_asc":
        orderCriteria = [["name", "ASC"]];
        break;
      case "name_desc":
        orderCriteria = [["name", "DESC"]];
        break;
      default:
        orderCriteria = [["createdAt", "DESC"]];
        break;
    }

    const sortedProducts = await Product.findAll({
      order: orderCriteria,
      include: [
        {
          model: Stock,
          include: [{ model: Capacities, attributes: ["name"] }],
        },
        { model: Image, attributes: ["url"], through: { attributes: [] } },
      ],
    });

    return sortedProducts;
  } catch (error) {
    throw new Error("Error al aplicar ordenamiento de productos: " + error.message);
  }
};

module.exports = applySorting;
