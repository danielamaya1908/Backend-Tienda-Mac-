const { Product } = require("../../db");

const updateProductQuantity = async (req, res) => {
  try {
    const { items } = req.body; // Suponemos que items es un array de { itemId, quantity } 

    // Validar que se hayan enviado productos
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No se enviaron productos para actualizar." });
    }

    // Iterar sobre los productos y actualizar la cantidad
    for (const item of items) {
      const product = await Product.findOne({ where: { itemId: item.itemId } });

      if (!product) {
        console.log("Producto no encontrado con itemId:", item.itemId);
        return res.status(404).json({ message: `Producto no encontrado: ${item.itemId}` });
      }

      // Verificar que haya suficiente stock
      if (product.quantity < item.quantity) {
        console.log(`Stock insuficiente para itemId: ${item.itemId}`);
        return res.status(400).json({ message: `Stock insuficiente para itemId: ${item.itemId}` });
      }

      // Restar la cantidad comprada del stock
      product.quantity -= item.quantity;

      // Guardar cambios
      await product.save();
    }

    console.log("Stock actualizado para los productos comprados.");
    res.status(200).json({ message: "Stock actualizado exitosamente." });

  } catch (error) {
    console.error("Error al actualizar el stock de productos:", error);
    res.status(500).json({ message: "Error al actualizar el stock de productos" });
  }
};

module.exports = updateProductQuantity;
