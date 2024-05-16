const { Product, Category, Brand, Subcategories, Colors, Capacities, /* Image */ } = require("../../db");

const getProductByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
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
       /*  {
          model: Image,
          attributes: ['id', 'path'],
        }, */
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const formattedProduct = {
      id: product.id,
      itemId: product.itemId,
      name: product.name,
      description: product.description,
      price: product.price,
      priceUsd: product.priceUsd,
      quantity: product.quantity,
      guarantee: product.guarantee,
      currency: product.currency,
      tax: product.tax,
      barcode: product.barcode,
      categoryId: product.Category.id,
      categoryName: product.Category.name,
      subcategoryId: product.Subcategory.id,
      subcategoryName: product.Subcategory.name,
      colorId: product.Color.id,
      colorName: product.Color.name,
      capacityId: product.Capacity.id,
      capacityName: product.Capacity.name,
      brandId: product.Brand.id,
      brandName: product.Brand.name,
     /*  images: product.Images.map(image => image.path), */
    };

    res.status(200).json(formattedProduct);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ message: "Error getting product" });
  }
};

module.exports = getProductByPk;