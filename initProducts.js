const postProduct = require("./src/controllers/product/postProduct");
const { allProducts } = require("./src/utilities/initAllProducts");
const { Brand } = require("./src/db");
const allBrands = require("./src/utilities/brands");

async function initializeProducts() {
  try {
    const resultados = [];
    for (const productData of allProducts) {
      const req = { body: productData };
      const res = {
        status: (code) => ({
          json: (data) => {
            resultados.push({ code, data });
          },
        }),
      };

      await postProduct(req, res);
    }
    if (allBrands && allBrands.length) {
      await Brand.bulkCreate(allBrands);
    }
    console.log("Productos inicializados con éxito.");
  } catch (error) {
    console.error("Error al inicializar los productos o reviews", error.message);
  }
}

initializeProducts();
