const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const SoporteTecnico = sequelize.define("SoporteTecnico", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serial: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    garantia: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    enciende: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    arranca: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    parlantes: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    teclado: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    camara: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    bluetooth: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    wifi: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    pinCarga: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "pin_de_carga",
    },
    auricular: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    botones: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    pantalla: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    golpes: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    rayones: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    puertos: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    imagenesEstado: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM,
      values: [
        "Ingreso",
        "Pendiente",
        "Diagnosticando",
        "Reparando",
        "Reparado",
        "Entregado",
      ],
      allowNull: false,
      defaultValue: "Ingreso",
    },
    fechaIngreso: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    fechaSalida: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    diagnosticoDescripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return SoporteTecnico;
};
