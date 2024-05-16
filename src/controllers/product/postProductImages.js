/* const { Image } = require("../../db");

const postProductImages = async (req, res) => {
  try {
    const { productId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No se ha seleccionado ninguna imagen' });
    }

    const images = await Promise.all(
      files.map(async (file) => {
        const image = await Image.create({
          productId: productId,
          path: file.path,
        });
        return image;
      })
    );

    res.status(201).json({ message: 'Imágenes cargadas exitosamente', images });
  } catch (error) {
    console.error('Error al cargar las imágenes del producto:', error);
    res.status(500).json({ message: 'Error al cargar las imágenes del producto' });
  }
};

module.exports = postProductImages; */