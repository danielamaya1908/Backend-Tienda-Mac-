const search = require("../../handlers/Product/searchProduct");

const searchProduct = async (req, res) => {
  try {
    await search(req, res);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = searchProduct;
