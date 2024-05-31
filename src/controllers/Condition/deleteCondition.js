const { Condition } = require("../../db");

const deleteCondition = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar la condición por su ID
    const condition = await Condition.findByPk(id);

    if (!condition) {
      console.log(`Condition with id ${id} not found`);
      return res.status(404).json({ message: "Condition not found" });
    }

    // Eliminar la condición
    await condition.destroy();

    console.log(`Condition with id ${id} deleted`);
    res.json({ message: "Condition deleted successfully" });
  } catch (error) {
    console.error("Error deleting condition:", error);
    res.status(500).json({ message: "Error deleting condition" });
  }
};

module.exports = deleteCondition;