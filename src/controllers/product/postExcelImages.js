const fs = require("fs").promises;
const xlsx = require("xlsx");
const { ImageProduct, Product } = require("../../db");

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

    for (const row of data) {
      const { itemId, image_name } = row;

      const product = await Product.findOne({ where: { itemId } });

      if (product) {
        const imageFolderPath =
          process.env.IMAGE_FOLDER_PATH || "src/ImagesProducts"; // Define la carpeta de imágenes

        // Lee la imagen como bytes (Buffer)
        const fullImagePath = `${imageFolderPath}/${image_name}`;
        const imageData = await fs.readFile(fullImagePath);

        // Almacena los bytes de la imagen en la base de datos
        const image = await ImageProduct.create({
          imageData,
          productId: product.id,
          itemId: itemId,
        });

        console.log(`Image ${image.id} uploaded for product ${product.id}`);
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
