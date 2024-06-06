const { Image } = require("../../db");

const deleteAllImages = async (req, res) => {
  try {
    await Image.destroy({ where: {} });
    console.log("All images have been deleted");
    res.status(200).json({ message: "All images have been deleted successfully" });
  } catch (error) {
    console.error("Error deleting images:", error);
    res.status(500).json({ message: "Error deleting images" });
  }
};

module.exports = deleteAllImages;
