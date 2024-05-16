const { User } = require("../../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Función para validar el token
function validateResetToken(token, secret) {
  try {
    const decodedToken = jwt.verify(token, secret);

    if (decodedToken.exp < Date.now() / 1000) {
      return { valid: false, error: "Token has expired" };
    }

    return { valid: true, userId: decodedToken.userId };
  } catch (error) {
    return { valid: false, error: "Invalid token" };
  }
}

// Función para actualizar el password
async function updatePassword(userId, newPassword) {
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return { success: true };
  } catch (error) {
    return { success: false, error: "Error updating password" };
  }
}

module.exports = { validateResetToken, updatePassword };
