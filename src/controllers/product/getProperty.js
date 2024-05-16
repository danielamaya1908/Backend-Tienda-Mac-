const { Product, Stock, Image, Color, Capacities } = require("../../db");

const getProperty = async (req, res) => {
    try {
        let { property } = req.query;
        if (typeof property === "string") {
            // Si es un string, lo convertimos en un array de una sola propiedad
            property = [property];
        }
        const queryOptions = {
            attributes: [],
            group: [],
            raw: true,
        };
        property.forEach((property) => {
            queryOptions.attributes.push(property);
            queryOptions.group.push(property);
        });
        const result = await Product.findAll(queryOptions);
        const responseArray = result?.map((item) => item[property[0]]);

        if (responseArray.length) {
            res.json(responseArray);
        }
    } catch (error) {
        console.error({ error: error.message });
        res.status(500).json({ error: error.message });
    }
};

module.exports = getProperty;
