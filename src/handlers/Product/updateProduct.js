const { Product, Image, Stock, Capacities, Color } = require("../../db");

const updateProduct = async (product) => {
  console.log(product);
  try {
    productEdit = await Product.findByPk(product.id);

    if (product.discount && Number(product.discount) > 0 && Number(product.discount) <= 100) {
      product.price = (productEdit.price * (100 - Number(product.discount))) / 100; // El precio debe quedar registrado en la BDD con el descuento aplicado.
      console.log(product.price);
    }

    await Product.update(product, {
      where: {
        id: product.id,
      },
    });
    if (product.images) {
      await productEdit.setImages([]);
      const createdImages = await Promise.all(product.images.map((img) => Image.create({ url: img })));
      await productEdit.addImages(createdImages);
    }

    if (product.color) {
      await productEdit.setColors([]);
      for (const colorName of product.color) {
        const [existingColor, colorCreated] = await Color.findOrCreate({
          where: { name: colorName.toUpperCase() },
        });
        await productEdit.addColor(existingColor);
      }
    }

    if (product.sizes) {
      for (const stockInfo of product.sizes) {
        const [size, created] = await Capacities.findOrCreate({
          where: { name: stockInfo.size },
        });

        const [stock, stockCreated] = await Stock.findOrCreate({
          where: {
            ProductId: productEdit.id,
            CapacitiesId: size.id,
          },
          defaults: {
            quantity: stockInfo.stock,
          },
        });

        if (!stockCreated) {
          await stock.update({ quantity: stockInfo.stock });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  return "El Producto se actualizó correctamente";
};
module.exports = updateProduct;
