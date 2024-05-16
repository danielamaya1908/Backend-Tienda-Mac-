const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.ENUM('failed', 'success'),
            defaultValue: 'success'
        }
    }, { timestamps: true });
}