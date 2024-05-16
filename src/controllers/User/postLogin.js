const login = require("../../handlers/User/login");

const PostLogin = async (req, res) => {
  try {
    login(req, res);
  } catch (error) {
    console.error("Error durante el inicio de sesión:", error);
  }
};

module.exports = PostLogin;
