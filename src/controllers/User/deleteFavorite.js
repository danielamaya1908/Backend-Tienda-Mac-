const { User, Product, user_like } = require("../../db");

const deleteFavorite = async (req, res) => {
    try {
        const { userId, productId } = req.query;

        if (!userId || !productId) {
            return res.status(400).json('Faltan datos');
        }

        // Verificar si el usuario y el producto existen
        const user = await User.findByPk(userId);
        const product = await Product.findByPk(productId);

        if (!user || !product) {
            return res.status(404).json('Usuario o producto no encontrado');
        }

        // Verificar si la relación existe en la tabla intermedia
        const existingLike = await user_like.findOne({
            where: {
                UserId: userId,
                ProductId: productId,
            },
        });

        if (!existingLike) {
            return res.status(404).json('La relación no existe, no se puede eliminar');
        }

        // Eliminar la relación de la tabla intermedia
        await existingLike.destroy();

        // Recupera los likes de productos actualizados del usuario
        const favorites = await user_like.findAll({
            where: {
                UserId: userId,
            },
        });

        return res.status(200).json({
            message: `Like del producto de id ${existingLike.ProductId} eliminado correctamente`,
            favorites,
        });
    } catch (error) {
        console.error("Error en el handler removeLike:", error.message);
        return res.status(500).json('Error interno del servidor');
    }
};

module.exports = deleteFavorite;
