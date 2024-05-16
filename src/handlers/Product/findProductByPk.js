const { Product, Image, Stock, Capacities, Color, Reviews } = require("../../db");

const findProductByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Capacities, attributes: ["name"], through: { model: Stock } },
        { model: Image, attributes: ["url"], through: { attributes: [] } },
        { model: Color, attributes: ["name"], through: { attributes: [] } },
        {
          model: Reviews,
          attributes: ["id", "description", "score", "UserId"],
          where: { status: "accepted" },
          required: false,
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Crear un nuevo objeto para el producto
    const modifiedProduct = { ...product.toJSON() };

    // Modificar el array de imágenes
    modifiedProduct.Images = modifiedProduct.Images.map((image) => image.url);

    // Verificar si existe la propiedad Color antes de mapear
    if (modifiedProduct.Colors) {
      modifiedProduct.Colors = modifiedProduct.Colors.map(({ name }) => name);
    }

    // Modificar el array de tallas y cantidades (stock)
    modifiedProduct.Stocks = modifiedProduct.Capacitiess.map((size) => ({
      [size.name]: size.Stock.quantity, // Acceder a la cantidad de stock desde la relación con Capacities
    }));

    // Eliminar la propiedad 'Capacities' si no es necesaria en este punto
    delete modifiedProduct.Capacities;

    return res.status(200).json({
      data: modifiedProduct,
    });
  } catch (error) {
    console.error("Error al obtener el producto por PK:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { findProductByPk };
