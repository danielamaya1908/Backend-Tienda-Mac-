const bcrypt = require("bcrypt");
const { User, ShoppingCart, user_like } = require("../../db");
const { Sequelize } = require("sequelize");
const { serialize } = require("cookie");
const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../../../config");
const getUserByID = require("./getUserByID");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, externalSignIn: false } });
  if (user) {

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      if (!user.active) {
        console.error("Cuenta bloqueada");
        return res.status(200).json({
          message: `Cuenta de ${user.firstName} desactivada`,
          user: {
            id: user.id,
            active: user.active,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            email: user.email,
            address: user.address,
            city: user.city,
            zipCode: user.zipCode,
            phoneNumber: user.phoneNumber,
            sendMailsActive: user.sendMailsActive,
            rol: user.rol,
            externalSignIn: user.externalSignIn
          }
        });
      }
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.firstName,
          rol: user.rol,
        },
        SECRETKEY,
        { expiresIn: "1h" }
      );

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600000,
      };
      const tokenCookie = serialize("token", token, cookieOptions);

      res.setHeader("Set-Cookie", tokenCookie);

      // Vemos si el usuario tiene carrito de compras.
      const userCart = await ShoppingCart.findOne({
        where: { UserId: user.id, available: true },
      });
      console.log(userCart);
      let cartToken = null;
      if (userCart) {
        cartToken = jwt.sign(
          {
            id: userCart.id,
            total: userCart.total,
            available: userCart.available,
            UserId: user.id,
            type: userCart.type
          },
          SECRETKEY,
          { expiresIn: "1h" }
        );
        const cartTokenCookieOptions = {
          httpOnly: true,
          maxAge: 3600000,
        };
        const cartTokenCookie = serialize("cartToken", cartToken, cartTokenCookieOptions);
        res.setHeader("Set-CartCookie", cartTokenCookie);
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
      //enviamos al front la data del usuario mas el token de usuario y el token de su carrito.
      return res.status(200).json({
        message: `Login exitoso, bienvenido ${user.firstName}!`,
        token,
        cartToken,
        user: {
          id: user.id,
          cartId: userCart ? userCart.id : null,
          active: user.active,
          firstName: user.firstName,
          lastName: user.lastName,
          image: user.image,
          email: user.email,
          address: user.address,
          city: user.city,
          zipCode: user.zipCode,
          phoneNumber: user.phoneNumber,
          sendMailsActive: user.sendMailsActive,
          rol: user.rol,
          externalSignIn: user.externalSignIn,
          favorites: favorites.productIds
        }
      });
    } else {
      console.error("Contraseña incorrecta");
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
  } else {
    console.error("Usuario no encontrado");
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
};

module.exports = login;
