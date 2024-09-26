const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      documentNumber: { // Nuevo campo para el número de documento
        type: DataTypes.STRING(50),
        allowNull: true, // No permitir NULL
        unique: true,  // Asegura que cada documento sea único
      },
      externalSignIn: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      sendMailsActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      zipCode: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        unique: true, // Cambiado a único para evitar duplicados
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      rol: {
        type: DataTypes.ENUM("client", "admin", "super_admin"),
        allowNull: true,
        defaultValue: "client",
      },
      image: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    { timestamps: true }
  );
};
