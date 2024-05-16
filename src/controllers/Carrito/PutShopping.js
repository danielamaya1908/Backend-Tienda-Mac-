const { ShoppingCart, Cart_Product } = require("../../db");
const { Op } = require("sequelize");

const putShopping = async (req, res) => {
  try {
    const { idUser, products } = req.body;

    if (!idUser) {
      return res.status(401).json({ error: "Falta id del usuario" });
    }

    if (products.length === 0) {
      return res.status(401).json({ error: "El carrito esta vacío" });
    }
    // Primero se busca el carrito que tenga asignado en UserId
    const cartUser = await ShoppingCart.findOne({
      where: { UserId: idUser },
    });
    console.log(cartUser);
    //Si no se encuentra un carrito asignado al usuario se da aviso
    if (cartUser === null) {
      return res.status(401).json({ error: "no se encontró carrito con ese UserId" });
    }

    const mapeoInicial = products.map((producto) => {
      return {
        id: producto.id,
        size: producto.size,
        price: producto.price,
        quantity: producto.quantity,
        tallas: `Talle: ${producto.size}, Cantidad: ${producto.quantity}.`,
      };
    });
    const carrito = mapeoInicial.reduce((acc, producto) => {
      const existingProduct = acc.find((p) => p.id === producto.id);

      if (existingProduct) {
        // Si ya existe un producto con el mismo id, actualizar sus tallas
        existingProduct.tallas += producto.tallas;
      } else {
        // Si no existe, agregar el producto al array
        acc.push(producto);
      }

      return acc;
    }, []);

    // Se crea un array donde van a estar los datos de cada producto
    const productsInShop = [];

    //En este bucle se recorre el carrito para calcular el subtotal de cada producto
    for (let producto of carrito) {
      const regex = /Cantidad: (\d+)/g;
      let totalStock = 0;
      while ((match = regex.exec(producto.tallas)) !== null) {
        const cantidad = parseInt(match[1], 10);
        totalStock += cantidad;
      }

      await Cart_Product.update(
        {
          cantidad: totalStock,
          subtotal: producto.price * totalStock,
          detalle: producto.tallas,
        },
        {
          where: {
            [Op.and]: [{ ShoppingCartId: cartUser.id }, { ProductId: producto.id }],
          },
        }
      );
      //Se crea o se actualiza la relación entre Productos y el carrito
      const [newItem, created] = await Cart_Product.findOrCreate({
        where: {
          [Op.and]: [{ ShoppingCartId: cartUser.id }, { ProductId: producto.id }],
        },
        defaults: {
          ShoppingCartId: cartUser.id,
          ProductId: producto.id,
          cantidad: totalStock,
          subtotal: producto.price * totalStock,
          detalle: producto.tallas,
        },
      });

      //Se guarda en el array los datos del producto, juntos con los talles seleccionados
      productsInShop.push(newItem);
    }

    const subTotales = productsInShop.map((producto) => {
      return {
        subtotal: producto.dataValues.subtotal,
      };
    });
    const total = subTotales.reduce((acumulador, subtotal) => {
      const subtotalNumero = parseFloat(subtotal.subtotal);
      return acumulador + subtotalNumero;
    }, 0);

    //Se actualiza el total del carrito con lo que se recibe desde el front
    //(recordar que los descuentos se manejan desde el front)
    await ShoppingCart.update(
      { total: total },
      {
        where: {
          id: cartUser.id,
        },
      }
    );
    res.status(200).json({
      message: "Carrito actualizado",
      ShoppingCart: productsInShop,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = putShopping;
