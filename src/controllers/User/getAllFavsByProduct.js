const { sequelize, Product, user_like } = require("../../db");
const { Sequelize } = require("sequelize");

const getFavsByProduct = async (req, res) => {
    try {
        const productId = req.query.productId;

        if (!productId) {
            return res.status(400).json('Falta el productId en la consulta');
        }

        // Obtener la cantidad de likes por producto
        const favsByProduct = await user_like.count({
            where: {
                ProductId: productId,
            },
        });

        // Obtener información del producto
        const product = await Product.findByPk(productId, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        return res.status(200).json({
            product,
            favs: favsByProduct,
        });
    } catch (error) {
        console.error("Error en el handler getLikesByProduct:", error.message);
        return res.status(500).json('Error interno del servidor');
    }
};

module.exports = getFavsByProduct;
