const { ShoppingProduct, User_cart, User } = require("../../db");

const getUserCart = async (req, res) => {
    let { userId } = req.query;
    userId = parseInt(userId);

    try {
        let response = [];
        // Verificamos si el usuario existe
        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const userProducts = await ShoppingProduct.findAll(
            {
                where: { userId },
                attributes: [
                    ['productId', 'id'],
                    'price',
                    'quantity',
                    'size',
                    'title'
                ]
            }
        );
        if (userProducts) response = userProducts;
        return res.json({
            userId,
            cart: response
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = getUserCart;
