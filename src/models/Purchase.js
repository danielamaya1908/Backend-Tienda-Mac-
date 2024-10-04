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
      customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      customer_city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      customer_department: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      customer_address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reference: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      charge_id: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      customer_document_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    },
    { timestamps: true }
  );
};