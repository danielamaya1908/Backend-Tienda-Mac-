const { Op } = require("sequelize");
const { Product, Image, Stock, Capacities } = require("../../db");

const applyFilters = async (filters) => {
  try {
    const {
      gender,
      subCategory,
      category,
      minPrice,
      maxPrice,
      sizes,
      id,
      search,
    } = filters;

    const filterCriteria = {};

    filterCriteria.gender = gender || { [Op.not]: null };
    filterCriteria.subCategory = subCategory || { [Op.not]: null };
    filterCriteria.category = category || { [Op.not]: null };
    filterCriteria.id = id || { [Op.not]: null };

    if (minPrice && maxPrice && !isNaN(minPrice) && !isNaN(maxPrice)) {
      filterCriteria.price = {
        [Op.between]: [parseFloat(minPrice), parseFloat(maxPrice)],
      };
    }

    if (sizes && sizes.length > 0) {
      filterCriteria.CapacitiesId = {
        [Op.in]: sizes,
      };
    }

    if (search) {
      filterCriteria.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const filteredProducts = await Product.findAll({
      where: filterCriteria,
      include: [
        {
          model: Stock,
          include: [{ model: Capacities, attributes: ["name"] }],
        },
        { model: Image, attributes: ["url"], through: { attributes: [] } },
      ],
    });

    return filteredProducts;
  } catch (error) {
    throw new Error("Error al aplicar filtros de productos: " + error.message);
  }
};

module.exports = applyFilters;
