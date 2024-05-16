const deleteProductHandler = require("../../handlers/Carrito/deleteProduct");

const deleteProduct = async (req, res) => {
  try {
    const { shoppingId, productId } = req.body;

    const result = await deleteProductHandler(shoppingId, productId);

    if (result.message === "Producto eliminado del carrito") {
      return res.status(200).json(result);
    } else {
      return res.status(401).json(result);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = deleteProduct;
