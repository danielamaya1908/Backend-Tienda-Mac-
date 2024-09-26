// models/Purchase.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define(
    'Purchase',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'COP',
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      customer_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      reference: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      charge_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    { timestamps: true }
  );
};
