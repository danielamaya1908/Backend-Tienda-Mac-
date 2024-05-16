const { ShoppingCart, Cart_Product } = require("../../db");
const { Op } = require("sequelize");

const deleteProduct = async (shoppingId, productId) => {
  try {
    const cart = await ShoppingCart.findByPk(shoppingId);

    if (!cart) {
      return { message: "Carrito no encontrado" };
    }

    const deletedProduct = await Cart_Product.findOne({
      where: {
        [Op.and]: [{ ShoppingCartId: cart.id }, { ProductId: productId }],
      },
    });

    if (!deletedProduct) {
      return { message: "Producto no encontrado en el carrito" };
    }

    await Cart_Product.destroy({
      where: {
        ShoppingCartId: shoppingId,
        ProductId: productId,
      },
    });

    const productsInCart = await Cart_Product.findAll({
      where: { ShoppingCartId: shoppingId },
    });

    const subTotales = productsInCart.map((producto) => {
      return {
        subtotal: producto.dataValues.subtotal,
      };
    });
    const total = subTotales.reduce((acumulador, subtotal) => {
      const subtotalNumero = parseFloat(subtotal.subtotal);
      return acumulador + subtotalNumero;
    }, 0);

    await ShoppingCart.update({ total: total }, { where: { id: shoppingId } });

    return { message: "Producto eliminado del carrito", total: total };
  } catch (error) {
    return { message: error.message };
  }
};

module.exports = deleteProduct;
