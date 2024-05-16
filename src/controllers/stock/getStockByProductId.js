const { Stock, Capacities } = require("../../db");

const getStock = async (req, res) => {
  try {
    const { productId } = req.params;
    // console.log(productId);
    const response = await Stock.findAll({
      where: {
        ProductId: productId,
      },
    });

    const formattedResponse = await Promise.all(
      response.map(async (stock) => {
        const talla = await Capacities.findOne({
          where: {
            id: stock.dataValues.CapacitiesId,
          },
        });

        const resultado = {
          [talla.name]: stock.dataValues.quantity,
        };
        return resultado;
      })
    );
    const resultado = formattedResponse.reduce((acumulador, objeto) => {
      const talla = Object.keys(objeto)[0];
      const cantidad = objeto[talla];
      acumulador[talla] = cantidad;
      return acumulador;
    }, {});

    res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = getStock;
