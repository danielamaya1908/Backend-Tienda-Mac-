const { User, user_like } = require('../../db');
const { Sequelize } = require("sequelize");

const getUserByEmail = async (req, res) => {
    try {
        const { email, externalSignIn } = req.query;
        if (email && externalSignIn) {
            const user = await User.findOne({ where: { email, externalSignIn: externalSignIn, active: true } });
            if (user) {
                // Obtener los productos que el usuario ha agregado a sus favoritos
                const userLikes = await user_like.findAll({
                    attributes: ['UserId', [Sequelize.fn('array_agg', Sequelize.col('ProductId')), 'productIds']],
                    where: {
                        UserId: user.id,
                    },
                    group: ['UserId'],
                    raw: true,
                });

                // Extraer solo el resultado deseado
                const favorites = {
                    userId: userLikes[0]?.UserId,
                    productIds: userLikes[0]?.productIds || [],
                };
                res.json({
                    id: user.id,
                    active: user.active,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    image: user.image,
                    email: user.email,
                    address: user.address,
                    city: user.city,
                    country: user.country,
                    zipCode: user.zipCode,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    sendMailsActive: user.sendMailsActive,
                    externalSignIn: user.externalSignIn,
                    favorites: favorites.productIds
                })
            }
            else res.status(404).json('el usuario no existe');
        }
        else {
            res.status(404).json('faltan datos para completar la solicitus')
        }

    } catch (error) {
        console.error("Error al obtener usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = getUserByEmail;
