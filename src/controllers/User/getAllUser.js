// controllers/userController.js
const { User } = require("../../db");

// Obtener todos los usuarios (excluyendo la contraseña)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    if (!users || users.length === 0) {
      res.status(404).json({ message: "No se encontraron usuarios" });
    } else {
      res.status(200).json({ users });
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      res.status(404).json({ message: "Usuario no encontrado" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { name, email, password, firstName, lastName, rol } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      firstName,
      lastName,
      rol,
    });

    res.status(201).json({
      message: "Usuario creado con éxito",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un usuario existente
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, firstName, lastName, rol } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.update({ name, email, password, firstName, lastName, rol });

    res.status(200).json({
      message: "Usuario actualizado con éxito",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();
    res.status(200).json({ message: "Usuario eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
