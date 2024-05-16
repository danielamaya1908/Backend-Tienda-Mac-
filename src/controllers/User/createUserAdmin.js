const { UserAdmin } = require("../../db");

const createUserAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newUserAdmin = await UserAdmin.create({ email, password, role });
    res.status(201).json(newUserAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error creating user admin" });
  }
};

const getAllUserAdmins = async (req, res) => {
  try {
    const userAdmins = await UserAdmin.findAll();
    res.status(200).json(userAdmins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving user admins" });
  }
};

const validateUserAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userAdmin = await UserAdmin.findOne({ where: { email } });

    if (userAdmin && userAdmin.password === password) {
      res.status(200).json({ message: "User admin found" });
    } else {
      res.status(404).json({ message: "User admin not found or password incorrect" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error validating user admin" });
  }
};

const deleteUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const userAdmin = await UserAdmin.findByPk(id);

    if (!userAdmin) {
      return res.status(404).json({ message: "User admin not found" });
    }

    await userAdmin.destroy();
    res.status(200).json({ message: "User admin deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting user admin" });
  }
};

const updateUserAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;
    const userAdmin = await UserAdmin.findByPk(id);

    if (!userAdmin) {
      return res.status(404).json({ message: "User admin not found" });
    }

    userAdmin.email = email;
    userAdmin.password = password;
    userAdmin.role = role;
    await userAdmin.save();

    res.status(200).json({ message: "User admin updated", userAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user admin" });
  }
};

module.exports = {
  createUserAdmin,
  validateUserAdmin,
  deleteUserAdmin,
  updateUserAdmin,
  getAllUserAdmins,
};
