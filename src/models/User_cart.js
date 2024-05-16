const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('User_cart', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        ShoppingProductId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, { timestamps: true })
}