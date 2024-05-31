const { Product, Category, Brand, Subcategories, Capacities, Colors, Image } = require("../../db");

const getProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['id', 'name'],
        },
        {
          model: Brand,
          attributes: ['id', 'name'],
        },
        {
          model: Subcategories,
          attributes: ['id', 'name'],
        },
        {
          model: Capacities,
          attributes: ['id', 'name'],
        },
        {
          model: Colors,
          attributes: ['id', 'name'],
        },
        {
          model: Image,
          attributes: ['id', 'path'],
        },
      ],
    });

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const formattedProducts = products.map((product) => {
      const {
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
        Category,
        Brand,
        Subcategory,
        Capacity,
        Color,
        Image,
      } = product;
    
      const { id: categoryId, name: categoryName } = Category;
      const { id: brandId, name: brandName } = Brand;
      const { id: subcategoryId, name: subcategoryName } = Subcategory;
      const { id: capacityId, name: capacityName } = Capacity;
      const { id: colorId, name: colorName } = Color;
    
      const imageId = Image ? Image.id : null;
      const imagePath = Image ? Image.path : null;
    
      return {
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
        imagePath,
      };
    });

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Error getting products" });
  }
};

module.exports = getProduct;
