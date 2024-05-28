const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const { Image, Product } = require("../../db");

const postExcelImages = async (req, res) => {
  try {
    if (!req.files || !req.files.file) {
      return res.status(400).json({ message: "No Excel file uploaded" });
    }

    const file = req.files.file[0];

    // Procesar el archivo Excel
    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Ruta relativa a la carpeta de imágenes
    const imageFolderPath = path.join(__dirname, '..', '..', 'src', 'ImagesProducts');

    for (const row of data) {
      const { itemId, image_name } = row;

      const product = await Product.findOne({ where: { itemId } });

      if (product) {
        const fullImagePath = path.join(imageFolderPath, image_name);

        if (fs.existsSync(fullImagePath)) {
          const imageUrl = `${req.protocol}://${req.get("host")}/images/${image_name}`;
          const imageRecord = await Image.create({
            path: imageUrl,
            productId: product.id,
            itemId: itemId,
          });

          console.log(`Image ${imageRecord.id} uploaded for product ${product.id}`);
          await Product.update({ imageId: imageRecord.id }, { where: { id: product.id } });
        } else {
          console.log(`Image file not found: ${fullImagePath}`);
        }
      } else {
        console.log(`Product not found with itemId: ${itemId}`);
      }
    }

    res.status(200).json({ message: "Excel and images uploaded successfully" });
  } catch (error) {
    console.error("Error uploading Excel and images:", error);
    res.status(500).json({ message: "Error uploading Excel and images" });
  } finally {
    // Eliminar el archivo Excel después de procesarlo
    if (file) {
      fs.unlinkSync(file.path);
    }
  }
};

module.exports = postExcelImages;
