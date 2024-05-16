const { ShoppingProduct, User_cart, User } = require("../../db");

const deleteShoppingProduct = async (req, res) => {
    let { userId, productId, productCapacities } = req.query;
    console.log(req.query);
    userId = parseInt(userId);
    productId = parseInt(productId);
    try {
        // Verificamos si el usuario existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Buscamos el producto en el carrito
        const existingProduct = await ShoppingProduct.findOne({
            where: {
                productId: productId,
                userId,
                size: productCapacities
            }
        });

        if (existingProduct) {
            // Si el producto existe, lo eliminamos del carrito
            await existingProduct.destroy();
        }

        // Obtenemos todos los productos en el carrito del usuario después de la operación
        const userCart = await ShoppingProduct.findAll({
            where: {
                userId,
            },
        });

        return res.status(200).json({
            message: 'Producto eliminado del carrito exitosamente',
            userDataCart: userCart,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = deleteShoppingProduct;
