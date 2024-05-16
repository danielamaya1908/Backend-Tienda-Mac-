const { user_like } = require("../../db");
const { Sequelize } = require("sequelize");

const setFavoritesByUser = async (req, res) => {
    try {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json('Falta el userId en la consulta');
        }

        // Obtener los productos que el usuario ha agregado a sus favoritos
        const userLikes = await user_like.findAll({
            attributes: ['UserId', [Sequelize.fn('array_agg', Sequelize.col('ProductId')), 'productIds']],
            where: {
                UserId: userId,
            },
            group: ['UserId'],
            raw: true,
        });

        // Extraer solo el resultado deseado
        const result = {
            userId: userLikes[0]?.UserId,
            productIds: userLikes[0]?.productIds || [],
        };

        return res.status(200).json(result);
    } catch (error) {
        console.error("Error en el handler getUserLikes:", error.message);
        return res.status(500).json('Error interno del servidor');
    }
};

module.exports = setFavoritesByUser;
