const XLSX = require("xlsx");
const { Image } = require("../../db"); // Asegúrate de que este sea el modelo correcto para la tabla de imágenes
const fs = require("fs");
const path = require("path");

const deleteImagesByExcel = async (req, res) => {
  try {
    // Verificar que se haya subido un archivo
    if (!req.file) {
      return res.status(400).json({ message: "Por favor, carga un archivo Excel." });
    }

    // Leer el archivo Excel
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convertir los datos de la hoja de Excel en JSON
    const data = XLSX.utils.sheet_to_json(sheet);

    // Obtener los itemId's de las imágenes que queremos eliminar
    const itemIdsToDelete = data.map((row) => row.itemId).filter(Boolean);

    if (itemIdsToDelete.length === 0) {
      return res.status(400).json({ message: "El archivo Excel no contiene itemIds válidos." });
    }

    // Encontrar las imágenes que coinciden con los itemId's
    const imagesToDelete = await Image.findAll({
      where: { itemId: itemIdsToDelete },
      attributes: ["id", "path"]
    });

    if (imagesToDelete.length === 0) {
      return res.status(404).json({ message: "No se encontraron imágenes para los itemId's especificados." });
    }

    // Eliminar las imágenes tanto de la base de datos como de la carpeta de almacenamiento
    for (const image of imagesToDelete) {
      // Eliminar el archivo físico
      const imagePath = path.join(__dirname, "../../uploads", image.path); // Ajusta la ruta según tu configuración
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      // Eliminar el registro de la base de datos
      await image.destroy();
    }

    res.status(200).json({ message: "Imágenes eliminadas correctamente." });
  } catch (error) {
    console.error("Error al eliminar imágenes:", error);
    res.status(500).json({ message: "Error al eliminar imágenes." });
  }
};

module.exports = deleteImagesByExcel;
