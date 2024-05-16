const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const UserAdmin = sequelize.define(
    "UserAdmin",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      /* name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      }, */
      email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'superadmin'),
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return UserAdmin;
};
