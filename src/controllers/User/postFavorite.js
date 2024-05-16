const { User, Product, user_like } = require("../../db");

const postFavorite = async (req, res) => {
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
            return res.status(304).json('El usuario ya dio like a este producto');
        }

        // Crear la relación en la tabla intermedia
        await user_like.create({
            UserId: userId,
            ProductId: productId,
        });

        // recupera los likes de productos de un usuario
        const favorites = await user_like.findAll({
            where: {
                UserId: userId,
            }
        });


        return res.status(201).json({
            message: 'Like registrado correctamente',
            favorites
        })
    } catch (error) {
        console.error("Error en el handler postLike:", error.message);
        return res.status(500).json('Error interno del servidor');
    }
};

module.exports = postFavorite;
