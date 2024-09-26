const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ImageSoporteTecnico = sequelize.define("ImageSoporteTecnico", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    soporteTecnicoId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'SoporteTecnicos',
        key: 'id',
      },
      allowNull: false,
    }
  });

  return ImageSoporteTecnico;
};
