const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Product_size', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    }, { timestamps: true })
}