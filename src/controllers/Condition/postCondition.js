const { Condition } = require("../../db");

const postCondition = async (req, res) => {
  try {
    const { name } = req.body;

    // Verificar si ya existe una condición con el mismo nombre
    const existingCondition = await Condition.findOne({ where: { name } });
    if (existingCondition) {
      console.log("Condition with name already exists:", name);
      return res.status(400).json({ message: "Condition with this name already exists" });
    }

    // Crear la nueva condición
    const newCondition = await Condition.create({ name });

    console.log("New condition created:", newCondition.toJSON());

    res.status(201).json(newCondition);
  } catch (error) {
    console.error("Error creating condition:", error);
    res.status(500).json({ message: "Error creating condition" });
  }
};


module.exports = postCondition;
