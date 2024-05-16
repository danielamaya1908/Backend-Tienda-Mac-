const { ShoppingCart, Cart_Product } = require("../../db");
const { Op } = require("sequelize");

const updateProduct = async (userId, productId, newTotal, newTalle) => {
  try {
    const cartUser = await ShoppingCart.findOne({
      where: { UserId: userId },
    });

    if (!cartUser) {
      return { message: "No se encontró un carrito asociado a ese UserId" };
    }

    const cartProduct = await Cart_Product.findOne({
      where: {
        [Op.and]: [
          { ShoppingCartId: cartUser.id },
          { ProductId: productId },
        ],
      },
    });

    if (!cartProduct) {
      return { message: "El producto no está en el carrito" };
    }

    let stock = newTalle.reduce((resultado, talle) => {
      const unidades = Object.values(talle)[0];
      return resultado + unidades;
    }, 0);

    await Cart_Product.update(
      {
        cantidad: stock,
        subtotal: newTotal * stock,
      },
      {
        where: {
          [Op.and]: [
            { ShoppingCartId: cartUser.id },
            { ProductId: productId },
          ],
        },
      }
    );

    return { message: "Producto actualizado en el carrito" };
  } catch (error) {
    return { message: error.message };
  }
};

module.exports = updateProduct;
