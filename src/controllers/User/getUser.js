const getUserByID = require("../../handlers/User/getUserByID");
const { Sequelize } = require("sequelize");
const { user_like } = require("../../db");

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByID(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
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
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = getUser;
