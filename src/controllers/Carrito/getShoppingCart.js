const { ShoppingCart, Order, Cart_Product, Product } = require("../../db");

const getShoppingCart = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ message: "Id de Carrito no encontrado " });
    }

    const shoppingCart = await ShoppingCart.findOne({
      where: { id: id },
    });
    if (!shoppingCart) {
      return res.status(404).json({ message: "Carrito no encontrado para el ID ofrecido" });
    }

    const carrito = await Cart_Product.findAll({
      where: { ShoppingCartId: id },
    });
    const productosPromises = carrito.map(async ({ ProductId, detalle }) => {
      const nombreProducto = await Product.findOne({
        where: { id: ProductId }, // Usar ProductId directamente ya que está en el ámbito
      });

      const partes = detalle.split("Talle:").filter(Boolean);

      // Crear un array de objetos con talle y cantidad
      const resultado = partes.map((parte) => {
        const [talle, cantidad] = parte.split(", Cantidad: ");
        return {
          quantity: cantidad,
          size: talle,
        };
      });

      // Mapear cada resultado a un objeto de producto
      return resultado.map((product) => ({
        ProductId,
        title: nombreProducto.dataValues.title,
        price: nombreProducto.dataValues.price,
        discount:
          nombreProducto.dataValues.discount !== 0
            ? nombreProducto.dataValues.discount
            : "Este producto no tiene descuento",
        size: product.size,
        quantity: product.quantity,
      }));
    });

    // Esperar a que todas las promesas se resuelvan
    const productos = (await Promise.all(productosPromises)).flat();

    res.status(200).json({
      productos: productos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = getShoppingCart;
