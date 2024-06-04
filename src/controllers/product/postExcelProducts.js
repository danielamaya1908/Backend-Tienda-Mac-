const fs = require("fs");
const xlsx = require("xlsx");
const { Product, Category, Brand, Colors, Capacities, Subcategories, Condition } = require("../../db");

const trimProperty = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
};

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
        category = '',
        subcategory = '',
        brand = '',
        capacity = '',
        color = '',
        condition = '',
      } = row;

      // Eliminar espacios en blanco al inicio y al final de los valores
      const trimmedCategory = trimProperty(category);
      const trimmedSubcategory = trimProperty(subcategory);
      const trimmedBrand = trimProperty(brand);
      const trimmedCapacity = trimProperty(capacity);
      const trimmedColor = trimProperty(color);
      const trimmedCondition = trimProperty(condition);

      // Verificar si las propiedades están presentes en el objeto `row`
      if (!trimmedCategory || !trimmedSubcategory || !trimmedBrand || !trimmedCapacity || !trimmedColor || !trimmedCondition) {
        console.log('Fila con datos faltantes:', row);
        continue;
      }

      // Verificar si ya existe un producto con el mismo itemId
      const existingProductById = await Product.findOne({ where: { itemId } });
      if (existingProductById) {
        console.log("Product with itemId already exists:", itemId);
        continue;
      }

      // Buscar la instancia de Category utilizando el nombre proporcionado en el archivo Excel
      const categoryInstance = await Category.findOne({ where: { name: trimmedCategory } });
      if (!categoryInstance) {
        console.log("Category not found:", trimmedCategory);
        continue;
      }

      // Buscar la instancia de Brand utilizando el nombre proporcionado en el archivo Excel
      const brandInstance = await Brand.findOne({ where: { name: trimmedBrand } });
      if (!brandInstance) {
        console.log("Brand not found:", trimmedBrand);
        continue;
      }

      // Buscar la instancia de Colors utilizando el nombre proporcionado en el archivo Excel
      const colorInstance = await Colors.findOne({ where: { name: trimmedColor } });
      if (!colorInstance) {
        console.log("Color not found:", trimmedColor);
        continue;
      }

      // Buscar la instancia de Capacities utilizando el nombre proporcionado en el archivo Excel
      const capacityInstance = await Capacities.findOne({ where: { name: trimmedCapacity } });
      if (!capacityInstance) {
        console.log("Capacity not found:", trimmedCapacity);
        continue;
      }

      // Buscar la instancia de Subcategories utilizando el nombre proporcionado en el archivo Excel
      const subcategoryInstance = await Subcategories.findOne({ where: { name: trimmedSubcategory } });
      if (!subcategoryInstance) {
        console.log("Subcategory not found:", trimmedSubcategory);
        continue;
      }

      // Buscar la instancia de Condition utilizando el nombre proporcionado en el archivo Excel
      const conditionInstance = await Condition.findOne({ where: { name: trimmedCondition } });
      if (!conditionInstance) {
        console.log("Condition not found:", trimmedCondition);
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
        conditionId: conditionInstance.id,
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