const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "User_order",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      orderIdPaypal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      subTotal: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      totalOrder: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected", "cancelled"),
        allowNull: true,
        defaultValue: "pending",
      },
    },
    { timestamps: true }
  );
};
