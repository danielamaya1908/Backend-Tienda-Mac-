const { Condition } = require("../../db");

const getAllConditions = async (req, res) => {
  try {
    const conditions = await Condition.findAll({
      attributes: ["id", "name"],
    });
    console.log("All conditions found:", conditions);
    res.json(conditions);
  } catch (error) {
    console.error("Error retrieving conditions:", error);
    res.status(500).json({ message: "Error retrieving conditions" });
  }
};

module.exports = getAllConditions;