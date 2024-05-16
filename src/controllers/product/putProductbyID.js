const { Product, Category, Brand } = require("../../db");

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      itemId,
      name,
      description,
      price,
      priceUsd,
      quantity,
      image,
      guarantee,
      currency,
      tax,
      barcode,
      categoryId,
      brandId,
    } = req.body;

    const product = await Product.findByPk(id, {
      include: [Category, Brand],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const brand = await Brand.findByPk(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    await product.update({
      itemId,
      name,
      description,
      price,
      priceUsd,
      quantity,
      image,
      guarantee,
      currency,
      tax,
      barcode,
      categoryId,
      brandId,
    });

    // Enviar solo los datos necesarios del producto actualizado en la respuesta
    const updatedProduct = {
      itemId: product.itemId,
      name: product.name,
      description: product.description,
      price: product.price,
      priceUsd: product.priceUsd,
      quantity: product.quantity,
      image: product.image,
      guarantee: product.guarantee,
      currency: product.currency,
      tax: product.tax,
      barcode: product.barcode,
      categoryId: product.categoryId,
      brandId: product.brandId,
    };

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

module.exports = updateProduct;
