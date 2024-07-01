// getProductByItemId.js

const { Product, Category, Brand, Subcategories, Capacities, Colors, Image, sequelize } = require("../../db");
const { Sequelize, Op } = require("sequelize");

const getProductByItemId = async (req, res) => {
  const { category, subcategory, itemId } = req.params;

  try {
    const product = await Product.findOne({
      where: { itemId },
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
          where: { name: category }
        },
        {
          model: Brand,
          attributes: ['id', 'name']
        },
        {
          model: Subcategories,
          attributes: ['id', 'name'],
          where: { name: subcategory }
        },
        {
          model: Capacities,
          attributes: ['id', 'name']
        },
        {
          model: Colors,
          attributes: ['id', 'name']
        },
        {
          model: Image,
          attributes: ['id', 'path'] // Incluir los atributos que desees de Image
        },
      ]
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      id,
      name,
      description,
      price,
      priceUsd,
      quantity,
      guarantee,
      currency,
      tax,
      barcode,
      Category,
      Brand,
      Subcategory,
      Capacity,
      Color,
      Image
    } = product;

    const { id: categoryId, name: categoryName } = Category;
    const { id: brandId, name: brandName } = Brand;
    const { id: subcategoryId, name: subcategoryName } = Subcategory;
    const { id: capacityId, name: capacityName } = Capacity;
    const { id: colorId, name: colorName } = Color;

    const imageId = Image ? Image.id : null;
    const imagePath = Image ? Image.path : null;

    const formattedProduct = {
      id,
      itemId,
      name,
      description,
      price,
      priceUsd,
      quantity,
      guarantee,
      currency,
      tax,
      barcode,
      categoryId,
      categoryName,
      brandId,
      brandName,
      subcategoryId,
      subcategoryName,
      capacityId,
      capacityName,
      colorId,
      colorName,
      imageId,
      imagePath
    };

    res.status(200).json(formattedProduct);
  } catch (error) {
    console.error("Error getting product by itemId:", error);
    res.status(500).json({ message: "Error getting product" });
  }
};

module.exports = getProductByItemId;
