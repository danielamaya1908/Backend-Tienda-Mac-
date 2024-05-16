const { User } = require("../../db");
const bcrypt = require("bcrypt");

const updatePassword = async (id, newPassword) => {
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.update(
      { password: hashedPassword },
      {
        where: {
          id: id,
        },
      }
    );
    return "el Password se actualizo correctamente";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = updatePassword;
