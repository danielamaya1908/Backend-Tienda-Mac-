const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define(
        "ShoppingProduct",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            image1: {
                type: DataTypes.STRING(255),
                allowNull: true,
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
            }
        },
        { timestamps: false }
    );
};
