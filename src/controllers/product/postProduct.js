const fs = require("fs");
const { Product, Category, Brand, Colors, Capacities, Subcategories } = require("../../db");

const postProduct = async (req, res) => {
  try {
    const {
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
      brandId,
      colorId,
      capacityId,
      subcategoryId,
    } = req.body;

    const category = await Category.findByPk(categoryId);
    if (!category) {
      console.log("Category not found with ID:", categoryId);
      return res.status(404).json({ message: "Category not found" });
    }

    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      console.log("Brand not found with ID:", brandId);
      return res.status(404).json({ message: "Brand not found" });
    }

    const color = await Colors.findByPk(colorId);
    if (!color) {
      console.log("Color not found with ID:", colorId);
      return res.status(404).json({ message: "Color not found" });
    }

    const capacity = await Capacities.findByPk(capacityId);
    if (!capacity) {
      console.log("Capacity not found with ID:", capacityId);
      return res.status(404).json({ message: "Capacity not found" });
    }

    const subcategory = await Subcategories.findByPk(subcategoryId);
    if (!subcategory) {
      console.log("Subcategory not found with ID:", subcategoryId);
      return res.status(404).json({ message: "Subcategory not found" });
    }

    const newProduct = await Product.create({
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
      brandId,
      colorId,
      capacityId,
      subcategoryId,
    });

    console.log("New product created:", newProduct.toJSON());

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

module.exports = postProduct;
