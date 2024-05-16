const fs = require("fs");
const xlsx = require("xlsx");
const { Product, Category, Brand, Colors, Capacities, Subcategories } = require("../../db");

const postExcelProductsProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No Excel file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const createdProducts = [];

    for (const row of data) {
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
        category,
        subcategory,
        brand,
        capacity,
        color,
      } = row;

      // Verificar si ya existe un producto con el mismo itemId
      const existingProductById = await Product.findOne({ where: { itemId } });
      if (existingProductById) {
        console.log("Product with itemId already exists:", itemId);
        continue;
      }
      

      // Buscar la instancia de Category utilizando el nombre proporcionado en el archivo Excel
      const categoryInstance = await Category.findOne({ where: { name: category } });
      if (!categoryInstance) {
        console.log("Category not found:", category);
        continue;
      }

      // Buscar la instancia de Brand utilizando el nombre proporcionado en el archivo Excel
      const brandInstance = await Brand.findOne({ where: { name: brand } });
      if (!brandInstance) {
        console.log("Brand not found:", brand);
        continue;
      }

      // Buscar la instancia de Colors utilizando el nombre proporcionado en el archivo Excel
      const colorInstance = await Colors.findOne({ where: { name: color } });
      if (!colorInstance) {
        console.log("Color not found:", color);
        continue;
      }

      // Buscar la instancia de Capacities utilizando el nombre proporcionado en el archivo Excel
      const capacityInstance = await Capacities.findOne({ where: { name: capacity } });
      if (!capacityInstance) {
        console.log("Capacity not found:", capacity);
        continue;
      }

      // Buscar la instancia de Subcategories utilizando el nombre proporcionado en el archivo Excel
      const subcategoryInstance = await Subcategories.findOne({ where: { name: subcategory } });
      if (!subcategoryInstance) {
        console.log("Subcategory not found:", subcategory);
        continue;
      }

      // Crear el nuevo producto utilizando los IDs de las instancias relacionadas
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
        categoryId: categoryInstance.id,
        brandId: brandInstance.id,
        colorId: colorInstance.id,
        capacityId: capacityInstance.id,
        subcategoryId: subcategoryInstance.id,
      });

      createdProducts.push(newProduct);
    }

    console.log("Created products:", createdProducts);
    res.status(201).json({ message: "Products created successfully", products: createdProducts });
  } catch (error) {
    console.error("Error creating products from Excel:", error);
    res.status(500).json({ message: "Error creating products from Excel" });
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = postExcelProductsProducts;
