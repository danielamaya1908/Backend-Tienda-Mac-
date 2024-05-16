const { ShoppingProduct, User_cart, User } = require("../../db");

const putAllCart = async (req, res) => {
    let { userId, cart } = req.body;
    userId = parseInt(userId);

    try {
        // Verificamos si el usuario existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Eliminar todos los registros con el userId especificado
        await ShoppingProduct.destroy({
            where: { userId }
        });
        // Insertar los nuevos registros en la tabla
        await ShoppingProduct.bulkCreate(
            cart.map(product => ({
                productId: parseInt(product.id),
                userId,
                title: product.title,
                size: product.size,
                price: parseInt(product.price),
                quantity: parseInt(product.quantity),
                subTotal: parseInt(product.price) * parseInt(product.quantity),
            }))
        );

        const userCart = await ShoppingProduct.findAll({
            where: {
                userId,
            },
        });

        let newFormat = [];
        userCart.map(product => {
            newFormat.push({
                id: product.productId,
                title: product.title,
                size: product.size,
                price: product.price,
                quantity: product.quantity,
            })
        });

        return res.status(201).json({ userId, cart: newFormat });
    } catch (error) {
        return res.status(401).json({ error: error.message });
    }
};

module.exports = putAllCart;
