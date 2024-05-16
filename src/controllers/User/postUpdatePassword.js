const { validateResetToken, updatePassword } = require("../../handlers/User/postUpdatePassword");

const PostUpdatePassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const secret = "secreto_del_token";

    const validation = validateResetToken(token, secret);

    if (validation.valid) {
      const userId = validation.userId;
      const updateResult = await updatePassword(userId, newPassword);

      if (updateResult.success) {
        res.status(200).json({ message: "Contraseña actualizada exitosamente" });
      } else {
        res.status(500).json({ message: "Error al actualizar la contraseña" });
      }
    } else {
      res.status(400).json({ message: "Token no válido" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error en la solicitud de cambio de contraseña" });
  }
};

module.exports = PostUpdatePassword;
