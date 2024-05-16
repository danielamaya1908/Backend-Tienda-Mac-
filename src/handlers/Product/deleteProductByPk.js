const { Product } = require("../../db");

const deleteProductHandler = async (productId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new Error("Producto no encontrado");
  }

  await product.destroy();
};

module.exports = deleteProductHandler;
