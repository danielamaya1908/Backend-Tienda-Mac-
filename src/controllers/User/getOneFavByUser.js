const { User, Product, user_like } = require("../../db");

const getOneFavByUser = async (req, res) => {
    try {
        let { userId, productId } = req.query;
        userId = parseInt(userId);
        productId = parseInt(productId);

        if (!userId || !productId) {
            return res.status(400).json('Faltan datos');
        }

        // Verificar si el usuario y el producto existen
        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        if (!user || !product) {
            return res.status(404).json('Usuario o producto no encontrado');
        }

        // Verificar si ya existe la relación en la tabla intermedia
        const existingLike = await user_like.findOne({
            where: {
                UserId: userId,
                ProductId: productId,
            },
        });
        if (existingLike) {
            return res.status(201).json({
                message: 'Este producto está en tu colección',
            })
        }
        else {
            return res.status(304).json('No tienes este producto en tu colección');
        }
    } catch (error) {
        console.error("Error en el handler postLike:", error.message);
        return res.status(500).json('Error interno del servidor');
    }
};

module.exports = getOneFavByUser;
