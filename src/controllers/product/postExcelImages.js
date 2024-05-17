const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { Image, Product } = require("../../db");

const postExcelImages = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No Excel file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const imageFolderPath = "C:\\Users\\USER\\OneDrive\\Escritorio\\Tienda-Mac\\ImagesProducts";

    for (const row of data) {
      const { itemId, image_name } = row;

      const product = await Product.findOne({ where: { itemId } });

      if (product) {
        const fullImagePath = path.join(imageFolderPath, image_name);

        if (fs.existsSync(fullImagePath)) {
          const image = await Image.create({
            path: fullImagePath,
            productId: product.id,
            itemId: itemId, // Agrega el itemId al crear la imagen
          });

          console.log(`Image ${image.id} uploaded for product ${product.id}`);

          // Actualizar el campo imageId del producto con el ID de la imagen
          await Product.update({ imageId: image.id }, { where: { id: product.id } });
        } else {
          console.log(`Image file not found: ${fullImagePath}`);
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
      fs.unlinkSync(req.file.path);
    }
  }
};

module.exports = postExcelImages;
