const { Condition } = require("../../db");

const putConditionByID = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Buscar la condición por su ID
    const condition = await Condition.findByPk(id);

    if (!condition) {
      console.log(`Condition with id ${id} not found`);
      return res.status(404).json({ message: "Condition not found" });
    }

    // Actualizar la condición
    condition.name = name;
    await condition.save();

    console.log(`Condition with id ${id} updated`);
    res.json(condition);
  } catch (error) {
    console.error("Error updating condition:", error);
    res.status(500).json({ message: "Error updating condition" });
  }
};

module.exports = putConditionByID;