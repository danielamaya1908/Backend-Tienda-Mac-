const axios = require("axios");
const { User_order, ShoppingProduct, Capacities, Stock } = require("../../db");
const { PAYPAL_URL, PAYPAL_CLIENT, PAYPAL_SECRET_KEY, HOST_FRONT } = require("../../../config");
const { sendOrderConfirmationEmail } = require("../../email/mailer/mailer");

const captureUserOrder = async (req, res) => {
  try {
    let { token, ShoppingCartId, userId } = req.query;
    userId = parseInt(userId);
    let orderIdPaypal = token;
    const response = await axios.post(
      `${PAYPAL_URL}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_CLIENT,
          password: PAYPAL_SECRET_KEY,
        },
      }
    );
    const { id, status } = response.data;

    if (status === "COMPLETED") {
      // buscamos los productos que el usuario ordenó.
      const userOrders = await User_order.findAll({
        where: {
          userId,
        },
      });
      // Mapear y actualizar los registros
      const updatedUserOrders = userOrders.map(async (userOrder) => {
        const updatedOrder = await userOrder.update({
          status: "accepted",
        });
        return updatedOrder;
      });

      // Esperar a que todas las actualizaciones se completen
      const result = await Promise.all(updatedUserOrders);

      // borramos los registros de ShoppingProduct que pertenecían al usuario para limpiar su carrito
      const userShoppingProducts = await ShoppingProduct.findAll({
        where: {
          userId: userId,
        },
      });
      const descuentoStock = userShoppingProducts.map(async (producto) => {
        const todoString = producto.dataValues.size.toString();
        const sizeId = await Capacities.findOne({
          where: { name: todoString },
        });
        const idCapacities = sizeId.dataValues.id;
        if (idCapacities) {
          const stockRecord = await Stock.findOne({
            where: {
              ProductId: producto.dataValues.productId,
              CapacitiesId: idCapacities,
            },
          });
          if (stockRecord) {
            const stockQuantity = stockRecord.quantity;
            const updatedStockQuantity = stockQuantity - parseInt(producto.dataValues.quantity);

            // Actualizar el stock en la base de datos
            await Stock.update(
              { quantity: updatedStockQuantity },
              {
                where: {
                  ProductId: producto.dataValues.productId,
                  CapacitiesId: idCapacities,
                },
              }
            );
          }
        }
      });
      await Promise.all(descuentoStock);
      const deletedUserShoppingProducts = userShoppingProducts.map(async (userShoppingProduct) => {
        // Borrar cada registro
        await userShoppingProduct.destroy();
      });
      // Esperar a que todas las eliminaciones se completen
      await Promise.all(deletedUserShoppingProducts);

      sendOrderConfirmationEmail(userId, orderIdPaypal);

      const redirectUrl = `${HOST_FRONT}/payment-status?orderId=${id}&status=${status}`;
      return res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error("Error al capturar la orden:", error);
    return res.status(500).json({ error: "Error Interno del Servidor" });
  }
};

module.exports = captureUserOrder;
