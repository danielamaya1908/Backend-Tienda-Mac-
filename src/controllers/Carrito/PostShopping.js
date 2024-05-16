const { ShoppingCart, User } = require("../../db");
const jwt = require("jsonwebtoken");
const { SECRETKEY } = require("../../../config");
const { serialize } = require("cookie");

const postShopping = async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (type !== 'guest' && type !== 'member') {
      return res.status(401).json({ error: "Type inválido" });
    }

    if (!userId) {
      return res.status(401).json({ error: "Falta id del usuario" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ error: "No existe el Usuario en la BD" });
    }

    const [newCart, created] = await ShoppingCart.findOrCreate({

      where: { UserId: userId, available: true  },
      defaults: {
        type: type
      }

    });

    if (created) {
      const token = jwt.sign(
        {
          id: newCart.id,
          total: newCart.total,
          available: newCart.available,
          UserId: userId,
          type: type ? type : 'guest'
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

      return res.status(201).json({
        message: "Carrito creado exitosamente",
        token,
      });
    } else {

      return res.status(200).json({
        message: "Carrito existente", 
        shoppingCart: newCart});

    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = postShopping;