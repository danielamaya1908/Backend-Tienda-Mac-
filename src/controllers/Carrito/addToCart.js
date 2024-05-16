const addProduct = require("../../handlers/Carrito/addProduct");

const addToCart = async (req, res) => {
  try {
    const { idUser, products } = req.body;
    if (!idUser) {
      return res.status(401).json({ error: "Falta id del usuario" });
    }

    if (products.length === 0) {
      return res.status(401).json({ error: "El carrito esta vacio" });
    }

    const response = await addProduct(idUser, products);
    if (response.message === "Carrito actualizado") {
      return res.status(200).json(response);
    } else {
      return res.status(401).json(response);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = addToCart;
