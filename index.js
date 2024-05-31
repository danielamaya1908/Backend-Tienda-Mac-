require("dotenv").config();

const { sequelize } = require("./src/db");
const app = require("./src/app");
//const PORT = process.env.PORT || 3005;
//const PORT = process.env.PORT;
const { PORT, FRONTEND_URL } = require('./config');
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Sequelize synced successfully"); // Agrega este console.log
    app.listen(PORT, () => {
      console.log(`server listening on port ${PORT}`);
    });
  })
  .catch((error) => console.error(error.message));
