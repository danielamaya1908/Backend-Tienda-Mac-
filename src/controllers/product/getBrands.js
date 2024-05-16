const { Product, Brand } = require("../../db");

const getBrands = async (req, res) => {
    try {
        const result = await Brand.findAll();
        if (result) {
            return res.json(result);
        }
    } catch (error) {
        console.error({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

module.exports = getBrands;
