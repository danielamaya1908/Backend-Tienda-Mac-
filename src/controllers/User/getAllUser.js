const { User } = require("../../db");

const getAllUsers = async (req, res) => {
  try {
    const Users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!Users) {
      res.status(404).json({ message: "No se encontraron usuarios" });
    } else {
      res.status(200).json({ Users });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error });
  }
};
module.exports = getAllUsers;
