const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Agregar esta línea
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    priceUsd: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    guarantee: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    barcode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    brandId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Brands",
        key: "id",
      },
    },
    colorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Colors",
        key: "id",
      },
    },
    capacityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Capacities",
        key: "id",
      },
    },
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Subcategories",
        key: "id",
      },
    },
    imageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Images",
        key: "id",
      },
    },
    conditionId: {
      type: DataTypes.INTEGER,
      allowNull: true, // o true, dependiendo de tus necesidades
      references: {
        model: 'Conditions',
        key: 'id'
      }
    },
   /*  isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Puedes establecer un valor predeterminado según tus necesidades
    },     */
  });

  console.log("Product model defined");

  return Product;
};
