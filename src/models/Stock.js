const { DataTypes } = require("sequelize");
const Product = require("./Product");

module.exports = (sequelize) => {
  sequelize.define(
    "Stock",
    {
      ProductId: {
        type: DataTypes.INTEGER,
        references: {
          model: Product,
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { timestamps: false }
  );
};
