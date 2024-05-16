const axios = require("axios");
const { User_order, ShoppingProduct, User } = require("../../db");
const { HOST, PAYPAL_URL, PAYPAL_CLIENT, PAYPAL_SECRET_KEY } = require("../../../config");

const postOrder = async (req, res) => {
  try {
    let { userId } = req.body;
    userId = parseInt(userId);
    // Verificamos si el usuario existe
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // buscamos el carrito del usuario
    const userCart = await ShoppingProduct.findAll({
      where: {
        userId,
      },
    });
    if (!userCart) {
      return res.status(404).json({ message: "El usuario no cuenta con productos en su carrito" });
    }
    // buscamos los productos del carrito del usuario para sacar el total
    const newTotal = await ShoppingProduct.sum("subTotal", {
      where: { userId },
    });
    console.log(newTotal);
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "usd",
            value: newTotal,
          },
        },
      ],
      application_context: {
        brand_name: "TiendaMac",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/captureUserOrder?userId=${userId}`,
        cancel_url: `${HOST}/cancel-order`,
      },
    };
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(`${PAYPAL_URL}/v1/oauth2/token`, params, {
      auth: {
        username: PAYPAL_CLIENT,
        password: PAYPAL_SECRET_KEY,
      },
    });

    const { data: capturedOrder } = await axios.post(`${PAYPAL_URL}/v2/checkout/orders`, order, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { id } = capturedOrder;

    // Crear una entrada en la base de datos usando el modelo User_order
    const createProductPromises = userCart.map(async (product) => {
      return await User_order.create({
        orderIdPaypal: id,
        productId: product.productId,
        userId: product.userId,
        title: product.title,
        size: product.size,
        price: product.price,
        quantity: product.quantity,
        subTotal: product.subTotal,
        totalOrder: newTotal,
      });
    });
    await Promise.all(createProductPromises);
    return res.status(201).json({
      message: "Orden creada",
      access_token,
      orderUrl: capturedOrder.links[1].href,
    });
  } catch (error) {
    console.log("Error al crear la orden:", error);
    return res.status(500).json({ error: "Error Interno del Servidor" });
  }
};

module.exports = postOrder;
