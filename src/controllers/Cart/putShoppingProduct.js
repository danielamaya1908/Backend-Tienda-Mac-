const { ShoppingProduct, User_cart, User } = require("../../db");

const putShoppingProduct = async (req, res) => {
    let { userId, shoppingProduct } = req.body;
    userId = parseInt(userId);

    try {
        // Verificamos si el usuario existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // revisamos que no se repita el producto que queremos agregar
        const productRepeat = await ShoppingProduct.findOne({
            where: {
                productId: shoppingProduct.id,
                userId,
                size: shoppingProduct.size
            }
        })
        if (productRepeat) {
            await productRepeat.update({
                quantity: parseInt(shoppingProduct.quantity),
                subTotal: parseInt(shoppingProduct.price) * parseInt(shoppingProduct.quantity),
            })
        }
        else {
            const createdShoppingProduct = await ShoppingProduct.create({
                productId: parseInt(shoppingProduct.id),
                userId,
                title: shoppingProduct.title,
                size: shoppingProduct.size,
                price: parseInt(shoppingProduct.price),
                quantity: parseInt(shoppingProduct.quantity),
                subTotal: parseInt(shoppingProduct.price) * parseInt(shoppingProduct.quantity),
            });
        }
        const userCart = await ShoppingProduct.findAll({
            where: {
                userId,
            },
        });

        return res.status(201).json({
            message: 'Carrito actualizado exitosamente',
            userDataCart: userCart,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = putShoppingProduct;
