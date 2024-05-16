const { Cart_Product, ShoppingCart, User, Product, User_order } = require("../../db");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
const { HOST_FRONT } = require("../../../config");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  // aca deberíamos crear variables de entorno en Railway
  auth: {
    user: "TiendaMac07@gmail.com",
    pass: "xavv zswa wcyr dsye",
    // ===================================
  },
});

function sendWelcomeEmail(newUser) {
  const emailTemplatePath = path.resolve(__dirname, "../welcome.hbs");
  const emailHTML = fs.readFileSync(emailTemplatePath, "utf8");
  const emailContent = emailHTML.replace("{{userFirstName}}", newUser.user.firstName);

  transporter.sendMail({
    from: '"TiendaMac" <TiendaMac07@gmail.com>',
    to: newUser.user.email,
    subject: "Registro en TiendaMac",
    text: `Bienvenido ${newUser.firstName}!!, desde TiendaMac te agradecemos tu confianza`,
    html: emailContent,
  });
}
function sendWelcomeEmailExternal(newUser) {
  const emailTemplatePath = path.resolve(__dirname, "../welcome.hbs");
  const emailHTML = fs.readFileSync(emailTemplatePath, "utf8");
  const emailContent = emailHTML.replace("{{userFirstName}}", newUser.dataValues.firstName);
  transporter.sendMail({
    from: '"TiendaMac" <TiendaMac07@gmail.com>',
    to: newUser.dataValues.email,
    subject: "Registro en TiendaMac",
    text: `Bienvenido ${newUser.dataValues.firstName}!!, desde TiendaMac te agradecemos tu confianza`,
    html: emailContent,
  });
}

async function sendOrderConfirmationEmail(userId, orderIdPaypal) {
  const orderProducts = await User_order.findAll({
    where: { userId, orderIdPaypal },
  });
  const productos = orderProducts.map(({ orderIdPaypal, title, productId, quantity, size, subTotal, totalOrder }) => ({ orderIdPaypal, title, productId, quantity, size, subTotal, totalOrder }));

  const detalleProducto = [];

  for (let producto of productos) {
    const nombreProducto = await Product.findOne({
      where: { id: producto.productId },
    });

    detalleProducto.push({
      product: nombreProducto.dataValues.title,
      quantity: producto.quantity,
      detalle: producto.size,
      price: nombreProducto.dataValues.price,
      subTotal: nombreProducto.dataValues.price * producto.quantity,
    });
  }
  // const totalDeCarrito = await ShoppingCart.findByPk(ShoppingCartId);

  // const idUser = totalDeCarrito.dataValues.UserId;

  const user = await User.findByPk(userId);

  const userEmail = user.dataValues.email;

  const userName = user.dataValues.firstName;
  // console.log(detalleProducto);
  const emailTemplatePath = path.resolve(__dirname, "../orders.hbs");
  const emailHTML = fs.readFileSync(emailTemplatePath, "utf8");
  const emailContent = {
    orderId: productos.orderIdPaypal,
    Name: userName,
    products: detalleProducto,
    totalOrder: productos[0].totalOrder,
    orderId: orderIdPaypal
  };

  /*  handlebars.registerHelper("multiply", function (a, b) {
    return a * b;
  });
 */
  const renderedContent = handlebars.compile(emailHTML)(emailContent);

  transporter.sendMail({
    from: '"TiendaMac" <TiendaMac07@gmail.com>',
    to: userEmail,
    subject: "Confirmación de compra en TiendaMac",
    html: renderedContent,
  });
}

async function sendMailChangeOfPassword(mail) {
  const emailTemplatePath = path.resolve(__dirname, "../changeOfPassword.hbs");
  const emailHTML = fs.readFileSync(emailTemplatePath, "utf8");
  const user = await User.findOne({
    where: {
      email: mail,
      externalSignIn: false
    },
  });

  if (!user) {
    return {
      error: "El correo electrónico proporcionado no existe.",
      status: 401,
    };
  }
  // if (user.externalSignIn) {
  //   return {
  //     error: "este usuario fue registrado con su cuenta de google. No poseemos su contraseña en nuestro sitio web",
  //     status: 401,
  //   };
  // }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    "secreto_del_token",
    { expiresIn: "1m" }
  );
  const emailContent = {
    userFirstName: user.firstName,
  };
  const resetPasswordUrl = `${HOST_FRONT}/password-recover?token=${token}`;

  const renderedContent = handlebars.compile(emailHTML)({
    ...emailContent,
    resetPasswordUrl,
  });

  transporter.sendMail({
    from: '"TiendaMac" <TiendaMac07@gmail.com>',
    to: mail,
    subject: "Cambio de contraseña de TiendaMac",
    html: renderedContent,
  });
  return { email: user.email, token };
}

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendWelcomeEmailExternal,
  sendMailChangeOfPassword,
};
