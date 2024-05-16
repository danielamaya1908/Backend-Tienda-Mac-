const axios = require("axios");
const { Order, ShoppingCart, Cart_Product, Capacities, Stock } = require("../../db");
const { PAYPAL_URL, PAYPAL_CLIENT, PAYPAL_SECRET_KEY, HOST_FRONT } = require("../../../config");
const {sendOrderConfirmationEmail} = require("../../email/mailer/mailer")

const captureOrder = async (req, res) => {
  try {
    const { token, ShoppingCartId } = req.query;
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
      await Order.update(
        { status: "accepted" },
        {
          where: {
            orderIdPaypal: response.data.id,
          },
        }
      );
      await ShoppingCart.update(
        { available: false },
        {
          where: {
            orderIdPaypal: token,
          },
        }
      );

      const tukis = await Cart_Product.findAll({
        where: {
          ShoppingCartId: ShoppingCartId,
        },
      });
      // Verificamos si se encontraron resultados
      if (tukis.length > 0) {
        // Crear un array para almacenar las líneas
        const resultLines = [];

        // Iteramos sobre cada instancia y mostramos el detalle con ProductId
        for (const producto of tukis) {
          const productId = producto.dataValues.ProductId;
          const detalle = producto.dataValues.detalle;

          // Separar el detalle en combinaciones de talle y cantidad
          const matches = detalle.match(/Talle: (\w+), Cantidad: (\d+)/g);

          if (matches) {
            // Iterar sobre cada combinación en el detalle
            for (const match of matches) {
              const matchParts = match.match(/Talle: (\w+), Cantidad: (\d+)/);

              if (matchParts && matchParts.length === 3) {
                const talle = matchParts[1];
                const cantidad = matchParts[2];

                // Buscar todos los ID de Capacities relacionados con el talle
                const sizes = await Capacities.findAll({
                  where: {
                    name: talle,
                  },
                });
                if (sizes.length > 0) {
                  // Iterar sobre cada Capacities encontrado
                  for (const size of sizes) {
                    const sizeId = size.id;

                    // Restar la cantidad del stock
                    const stockRecord = await Stock.findOne({
                      where: {
                        ProductId: productId,
                        CapacitiesId: sizeId,
                      },
                    });

                    if (stockRecord) {
                      const stockQuantity = stockRecord.quantity;
                      const updatedStockQuantity = stockQuantity - parseInt(cantidad);

                      // Actualizar el stock en la base de datos
                      await Stock.update(
                        { quantity: updatedStockQuantity },
                        {
                          where: {
                            ProductId: productId,
                            CapacitiesId: sizeId,
                          },
                        }
                      );

                      console.log(
                        `Stock actualizado para ProductId: ${productId}, CapacitiesId: ${sizeId}, Cantidad restada: ${cantidad}`
                      );
                    } else {
                      console.log(`No se encontró registro de stock para ProductId: ${productId}, CapacitiesId: ${sizeId}`);
                    }
                  }
                } else {
                  console.log(`No se encontraron Capacitiess para el talle ${talle}`);
                }
              } else {
                console.log(`No se pudo analizar la combinación en el detalle para el producto con ID ${productId}`);
              }
            }
          } else {
            console.log(
              `No se encontraron combinaciones de talle y cantidad en el detalle para el producto con ID ${productId}`
            );
          }
        }

        // Imprimir todas las líneas al final del bucle
       /*  console.log(resultLines.join("\n")); */
      } else {
        console.log("No se encontraron resultados para el ShoppingCartId especificado.");
      }

      sendOrderConfirmationEmail(ShoppingCartId);

      const redirectUrl = `${HOST_FRONT}/payment-status?orderId=${id}&status=${status}`;
      return res.redirect(redirectUrl);
    }
  } catch (error) {
    console.error("Error al capturar la orden:", error);
    return res.status(500).json({ error: "Error Interno del Servidor" });
  }
};

module.exports = captureOrder;
