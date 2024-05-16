const { ShoppingProduct, User_cart, User } = require("../../db");

const postShoppingProduct = async (req, res) => {
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
                productId: parseInt(shoppingProduct.id),
                userId,
                size: shoppingProduct.size
            }
        })
        if (productRepeat) {
            return res.status(404).json({ message: 'Producto ya agregado' });
        }
        // Crear el registro en la tabla ShoppingProduct
        const createdShoppingProduct = await ShoppingProduct.create({
            productId: parseInt(shoppingProduct.id),
            userId,
            title: shoppingProduct.title,
            size: shoppingProduct.size,
            price: parseInt(shoppingProduct.price),
            quantity: parseInt(shoppingProduct.quantity),
            subTotal: parseInt(shoppingProduct.price) * parseInt(shoppingProduct.quantity),
        });

        // Devolvemos todos los productos agregados al user_cart del usuario hasta el momento
        const userCart = await ShoppingProduct.findAll({
            where: {
                userId,
            },
        });

        return res.status(201).json({
            message: 'Producto de compra creado exitosamente',
            userDataCart: userCart,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = postShoppingProduct;
