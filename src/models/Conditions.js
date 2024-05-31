const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Condition = sequelize.define(
    "Condition",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }
  );
  return Condition;
};
