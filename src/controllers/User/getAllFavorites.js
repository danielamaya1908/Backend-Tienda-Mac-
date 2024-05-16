const { sequelize, Product, user_like } = require("../../db");

const getAllFavorites = async (req, res) => {
    try {
        // Obtener todos los favoritos de la tabla intermedia agrupados por ProductId
        const groupedFavorites = await user_like.findAll({
            attributes: [
                'ProductId',
                [sequelize.fn('COUNT', sequelize.literal('DISTINCT "UserId"')), 'totalFavs'],
            ],
            group: ['ProductId']
        });
        console.log(groupedFavorites);

        return res.status(200).json(groupedFavorites);
    } catch (error) {
        console.error("Error en el handler getAllFavoritesGrouped:", error.message);
        return res.status(500).json('Error interno del servidor');
    }
};

module.exports = getAllFavorites;
