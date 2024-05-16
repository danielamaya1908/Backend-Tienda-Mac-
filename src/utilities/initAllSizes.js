const { Capacities } = require("../db");

const allCapacitiess = [
  { name: "11 pulgadas" },
  { name: "12 pulgadas" },
  { name: "13 pulgadas" },
  { name: "14 pulgadas" },
  { name: "15 pulgadas" },
  { name: "16 pulgadas" },
];


const initializeCapacitiess = async () => {
  try {
    // Ajusta esto según tus necesidades
    const sizesNames = allCapacitiess.map((size) => size.name); // extraemos solo los nombres de cada talla.
    const areTheyAlreadyCreated = await Capacities.findAll({ where: { name: sizesNames } });
    if (!areTheyAlreadyCreated.length) {
      await Capacities.bulkCreate(allCapacitiess);
    }
    console.log("Tallas inicializadas con éxito.");
  } catch (error) {
    console.error("Error al inicializar las tallas:", error.message);
  }
};

module.exports = initializeCapacitiess;
