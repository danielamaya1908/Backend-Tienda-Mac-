const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ImageHome = sequelize.define("ImageHome", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageData: {
      type: DataTypes.BLOB("long"), // Almacena los datos binarios de la imagen
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Products",
        key: "id",
      },
    },
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "Products",
        key: "itemId",
      },
    },
  });

  console.log("ImageHome model with BLOB data defined");
  return ImageHome;
};
