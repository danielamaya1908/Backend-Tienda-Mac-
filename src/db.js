const { DB_URL } = require("../config");

const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(`${DB_URL}`, {
  dialectModule: require("pg"),
  logging: false,
  native: false,
});

const modelDefiners = [];
// leemos la carpeta models y hacemos push al array anterior solo los archivos con extensión '.js'
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// instanciamos cada modelo del array, pasándole sequelize como parámetro ya que no lo importamos en los modelos.
modelDefiners.forEach((model) => model(sequelize));
// convertimos en mayúscula la inicial de cada modelo
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

const {
  User,
  Brand,
  Product,
  Order,
  Transaction,
  Image,
  ImageProduct,
  ImageHome,
  Stock,
  ShoppingCart,
  Purchase,
  Cart_Product,
  Reviews,
  Storage,
  Category,
  Colors,
  Subcategories,
  Capacities,
  Condition,
  SoporteTecnico,
  ImageSoporteTecnico,
  ImageEstado,
} = sequelize.models;

// creará una columna 'order_id' en la tabla Transaction con el id de una orden.
Order.hasMany(Transaction, {
  foreignKey: "order_id",
  sourceKey: "id",
});
Transaction.belongsTo(Order, {
  foreignKey: "order_id",
  targetKey: "id",
});

//relaciono la tabla Storage con la tabla stock
Storage.belongsToMany(Product, { through: Stock });
Product.belongsToMany(Storage, { through: Stock });

// tabla intermedia de las imágenes de cada producto.
Product.belongsTo(Image, { foreignKey: "imageId" });
Image.hasOne(Product, { foreignKey: "imageId" });

// Un producto puede tener múltiples imágenes
Product.hasMany(ImageProduct, { foreignKey: "productId", as: "images" });
// Cada imagen está asociada a un solo producto
ImageProduct.belongsTo(Product, { foreignKey: "productId" });

// Un producto puede tener múltiples imágenes para la página principal (nuevo alias "homeImages")
Product.hasMany(ImageHome, { foreignKey: "productId", as: "homeImages" });
// Cada imagen para la página principal está asociada a un solo producto
ImageHome.belongsTo(Product, { foreignKey: "productId", as: "homeImages" });

// tabla intermedia de los productos favoritos de cada usuario.
User.belongsToMany(Product, { through: "user_like" });
Product.belongsToMany(User, { through: "user_like" });

// tabla intermedia de los comentarios que tiene cada producto.
User.belongsToMany(Product, {
  through: "Comment",
});
Product.belongsToMany(User, {
  through: "Comment",
  onDelete: "CASCADE", // si un producto es eliminado, los comentarios y puntuación asociada a ese producto también serán eliminados.
});

// tabla intermedia de los órdenes de cada usuario.
User.belongsToMany(Product, { through: "Order" });
Product.belongsToMany(User, { through: "Order" });

// tabla intermedia de las compras recibidas por cada usuario.
/* User.belongsToMany(Product, { through: "Purchase" });
Product.belongsToMany(User, { through: "Purchase" }); */

// tabla de relación entre el carrito de compras y el usuario (uno a uno)
User.hasOne(ShoppingCart, {
  foreignKey: "UserId",
  scope: { available: true, type: "member" },
});
ShoppingCart.belongsTo(User, { foreignKey: "UserId" });

// tabla de relación entre el carrito de compras y el producto (muchos a muchos)
ShoppingCart.belongsToMany(Product, { through: Cart_Product });
Product.belongsToMany(ShoppingCart, { through: Cart_Product });

Stock.belongsTo(Product, { foreignKey: "ProductId" });
Stock.belongsTo(Storage, { foreignKey: "StorageId" });

// Relación entre Purchase y User, crea una tabla intermedia que funciona como carrito (UserPurchaseCart_product)
Purchase.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Purchase, { foreignKey: "userId" });

Purchase.belongsTo(Product, { foreignKey: "productId" });
Product.hasMany(Purchase, { foreignKey: "productId" });

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

User.hasMany(SoporteTecnico, { foreignKey: "userId" });
SoporteTecnico.belongsTo(User, { foreignKey: "userId" });

// Relación entre SoporteTecnico e ImageSoporteTecnico
// En tu archivo de asociaciones (e.g., `associations.js` o similar)
SoporteTecnico.hasMany(ImageSoporteTecnico, { foreignKey: "soporteTecnicoId" });
ImageSoporteTecnico.belongsTo(SoporteTecnico, {
  foreignKey: "soporteTecnicoId",
});

SoporteTecnico.hasMany(ImageEstado, { foreignKey: "soporteTecnicoId" });
ImageEstado.belongsTo(SoporteTecnico, { foreignKey: "soporteTecnicoId" });

Product.belongsTo(Brand, { foreignKey: "brandId" });
Brand.hasMany(Product, { foreignKey: "brandId" });

// Agregar la relación entre Product y Colors
Product.belongsTo(Colors, { foreignKey: "colorId" });
Colors.hasMany(Product, { foreignKey: "colorId" });

Product.belongsTo(Capacities, { foreignKey: "capacityId" });
Capacities.hasMany(Product, { foreignKey: "capacityId" });

Product.belongsTo(Subcategories, { foreignKey: "subcategoryId" });
Subcategories.hasMany(Product, { foreignKey: "subcategoryId" });

Category.hasMany(Subcategories, { foreignKey: "categoryId" });
Subcategories.belongsTo(Category, { foreignKey: "categoryId" });

Category.hasMany(Colors, { foreignKey: "categoryId" });
Colors.belongsTo(Category, { foreignKey: "categoryId" });

Category.hasMany(Capacities, { foreignKey: "categoryId" });
Capacities.belongsTo(Category, { foreignKey: "categoryId" });

Product.belongsTo(Condition, { foreignKey: "conditionId" });
Condition.hasMany(Product, { foreignKey: "conditionId" });

// En tu configuración donde defines las relaciones:
// Esto indica que un Color puede tener muchos Products.

// relación de reviews con users y products
Reviews.belongsTo(User);
User.hasMany(Reviews);
Reviews.belongsTo(Product);
Product.hasMany(Reviews);

module.exports = {
  sequelize,
  ...sequelize.models,
};
