const fs = require("fs").promises;
const path = require("path");
const xlsx = require("xlsx");
const { Image, Product } = require("../../db");

const postExcelImages = async (req, res) => {
  try {
    console.log("Current working directory:", process.cwd());
    
    if (!req.file) {
      return res.status(400).json({ message: "No Excel file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Ruta relativa a la carpeta de imágenes
    const imageFolderPath = process.env.IMAGE_FOLDER_PATH || path.join(process.cwd(), 'src', 'ImagesProducts');

    console.log("Ruta de la carpeta de imágenes:", imageFolderPath);
    
    try {
      const folderContents = await fs.readdir(imageFolderPath);
      console.log("Contenido de la carpeta:", folderContents);
    } catch (error) {
      console.error("Error al leer el contenido de la carpeta de imágenes:", error);
    }

    for (const row of data) {
      const { itemId, image_name } = row;

      const product = await Product.findOne({ where: { itemId } });

      if (product) {
        const fullImagePath = path.join(imageFolderPath, image_name);
        console.log("Intentando acceder a la imagen:", fullImagePath);

        try {
          await fs.access(fullImagePath);
          
          // Verificar si ya existe una imagen con el mismo nombre para el producto
          const existingImage = await Image.findOne({
            where: {
              path: fullImagePath,
              productId: product.id
            }
          });

          if (!existingImage) {
            const image = await Image.create({
              path: fullImagePath,
              productId: product.id,
              itemId: itemId,
            });

            console.log(`Image ${image.id} uploaded for product ${product.id}`);

            // Actualizar el campo imageId del producto con el ID de la imagen
            await Product.update({ imageId: image.id }, { where: { id: product.id } });
          } else {
            console.log(`Image already exists for product ${product.id}: ${image_name}`);
          }
        } catch (error) {
          console.log(`Image file not found or inaccessible: ${fullImagePath}`);
          console.error(error);
        }
      } else {
        console.log(`Product not found with itemId: ${itemId}`);
      }
    }

    res.status(200).json({ message: "Images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ message: "Error uploading images" });
  } finally {
    // Elimina el archivo Excel después de procesarlo
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
  }
};

module.exports = postExcelImages;