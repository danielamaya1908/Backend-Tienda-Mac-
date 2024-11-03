const { ImageProduct } = require("../../db");
const ExcelJS = require("exceljs");

const deleteImagesByExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0]; // Asumiendo que los datos están en la primera hoja
    const itemIds = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) { // Saltar el encabezado
        const itemId = row.getCell(1).value; // Ajusta si el `itemId` está en otra columna
        if (itemId) itemIds.push(itemId.toString());
      }
    });

    if (itemIds.length === 0) {
      return res.status(400).json({ message: "No valid itemIds found in the file" });
    }

    const imagesToDelete = await ImageProduct.findAll({
      where: { itemId: itemIds },
    });

    if (imagesToDelete.length === 0) {
      return res.status(404).json({ message: "No images found for the provided itemIds" });
    }

    // Eliminar imágenes en la base de datos
    await ImageProduct.destroy({
      where: { itemId: itemIds },
    });

    res.status(200).json({ message: `${imagesToDelete.length} images deleted successfully` });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ message: "Error deleting images" });
  }
};

module.exports = deleteImagesByExcel;
