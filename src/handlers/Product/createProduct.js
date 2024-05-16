/* const { Product, Image, Capacities, Stock, Color,  } = require("../../db");

const createProduct = async ({
  title,
  description,
  category,
  brand,
  color,
  subCategory,
  sizes,
  gender,
  price,
  discount,
  images,
  brand_id,
}) => {
  if (title && description && price && category && sizes.length && images.length) {
    const currentProduct = await Product.create({
      title: title.toUpperCase(),
      description: description.toUpperCase(),
      brand: brand.toUpperCase(),
      category: category.toUpperCase(),
      subCategory: subCategory.toUpperCase(),
      gender: gender.toUpperCase(),
      price,
      discount,
      brand_id,
    });

    // Crear tallas y stocks asociados
    for (const sizeInfo of sizes) {
      const [size, created] = await Capacities.findOrCreate({
        where: { name: sizeInfo.size },
      });
      await Stock.create({
        ProductId: currentProduct.id,
        CapacitiesId: size.id,
        quantity: sizeInfo.stock,
      });
    }

    // Procesar los colores
    for (const colorName of color) {
      // Buscar si el color ya existe en la tabla Color
      const [existingColor, colorCreated] = await Color.findOrCreate({
        where: { name: colorName.toUpperCase() },
      });

      // Asociar el color al producto
      await currentProduct.addColor(existingColor);
    }

    // Luego buscamos la tabla Image, solo las imágenes que mandó el front en el array "images", y vemos si ya existen.
    const isImagesCreated = await Image.findAll({ where: { url: images } });

    if (isImagesCreated.length === images.length) {
      // Si todas las imágenes ya existen, asociarlas al producto.
      await currentProduct.addImages(isImagesCreated);
      return "Producto creado e imágenes asociadas con éxito";
    } else {
      // Si al menos una imagen no existe, crear las imágenes que faltan.
      const newImages = images.filter((img) => !isImagesCreated.some((existingImage) => existingImage.url === img));
      const imagesPromises = newImages.map((img) => Image.create({ url: img }));
      const createdImages = await Promise.all(imagesPromises);
      await currentProduct.addImages(createdImages);

      return "Producto creado con sus nuevas imágenes";
    }
  }
};

module.exports = createProduct; */
