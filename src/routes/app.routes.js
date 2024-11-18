const { Router } = require("express");
const router = Router();
const postProduct = require("../controllers/product/postProduct");
const getProductByPk = require("../controllers/product/getProductByPk");
const getProduct = require("../controllers/product/getProduct");
const getProductOrderBy = require("../controllers/product/getProductOrderBy");
const deleteProductByPk = require("../controllers/product/deleteProductByPk");
const putProductbyID = require("../controllers/product/putProductbyID");
const searchProducts = require("../controllers/product/searchProduct");
const postRegister = require("../controllers/User/postRegister");
const postExcelProducts = require("../controllers/product/postExcelProducts");
const postExcelImages = require("../controllers/product/postExcelImages");
const getProductImages = require("../controllers/product/getProductImages");
const getImagesHome = require("../controllers/product/getImagesHome");
/* const postProductImages = require("../controllers/product/postProductImages"); */
const getAllConditions = require("../controllers/Condition/getAllCondition");
const postCondition = require("../controllers/Condition/postCondition");
const deleteCondition = require("../controllers/Condition/deleteCondition");
const putConditionByID = require("../controllers/Condition/updateCondition");
/* const updateProductStatus = require('../controllers/product/updateProductStatus'); */
const deleteAllImages = require("../controllers/product/deleteAllImages");
const getProductByCategoryAndSubcategory = require("../controllers/product/getProductByCategoryAndSubcategory");
const getProductByCategorySubcategoryAndProductName = require("../controllers/product/getProductByCategorySubcategoryAndName");
const getProductByItemId = require("../controllers/product/getProductByItemId");
const getRecentProducts = require("../controllers/product/getRecentProducts");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Ruta para subir archivo Excel de productos
router.post("/postExcelProducts", upload.single("file"), postExcelProducts);

// Ruta para subir imágenes desde archivo Excel
router.post("/postExcelImages", upload.single("file"), postExcelImages);

router.delete("/delete-all-images", deleteAllImages);

const postLogin = require("../controllers/User/postLogin");
const PostRegisterGoogle = require("../controllers/User/postRegisterGoogle");
/* const getUser = require("../controllers/User/getUser"); */
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers//User/getAllUser");
const {
  createUserAdmin,
  validateUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  getAllUserAdmins,
} = require("../controllers/User/createUserAdmin");
const {
  createCapacity,
  getAllCapacities,
  getCapacityById,
  updateCapacity,
  deleteCapacity,
} = require("../controllers/Capacity/CapacitiesController");

const {
  createPurchase,
  getAllPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
} = require("../controllers/Purchase/purchaseController");

// Ruta para crear una nueva compra
router.post("/purchase", createPurchase);

// Ruta para obtener todas las compras
router.get("/adminpurchases", getAllPurchases);

// Ruta para obtener una compra por ID
router.get("/purchase/:id", getPurchaseById);

// Ruta para actualizar una compra por ID
router.put("/purchase/:id", updatePurchase);

// Ruta para eliminar una compra por ID
router.delete("/purchase/:id", deletePurchase);

const {
  getPurchasesByUserId,
} = require("../controllers/Purchase/userPurchasesController");

// Ruta para obtener todas las compras de un usuario específico
router.get("/user-purchases/user/:userId", getPurchasesByUserId);

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/Category/CategoryController");

const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/Brand/BrandController");

const {
  createColor,
  getAllColors,
  getColorById,
  updateColor,
  deleteColor,
} = require("../controllers/Color/ColorsController");

const {
  createSubcategory,
  getAllSubcategories,
  getSubcategoryById,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/SubCategory/SubCategory");

const postShopping = require("../controllers/Carrito/PostShopping");
const putShopping = require("../controllers/Carrito/PutShopping");

const putUserById = require("../controllers/User/putUserById");

const getProperty = require("../controllers/product/getProperty");

const getDiscountProducts = require("../controllers/product/getDiscountProducts");
/* const getUserByEmail = require("../controllers/User/getUserByEmail"); */
const postFavorite = require("../controllers/User/postFavorite");
const deleteFavorite = require("../controllers/User/deleteFavorite");
const getAllFavorites = require("../controllers/User/getAllFavorites");
const getFavsByProduct = require("../controllers/User/getAllFavsByProduct");
const setFavoritesByUser = require("../controllers/User/getFavoritesByUser");
const getOneFavByUser = require("../controllers/User/getOneFavByUser");

const putPassword = require("../controllers/User/putPassword");
const captureOrder = require("../controllers/paypal/captureOrder");
const createOrder = require("../controllers/paypal/createOrder");
const cancelOrder = require("../controllers/paypal/cancelOrder");
const getBrands = require("../controllers/product/getBrands");

const getStock = require("../controllers/stock/getStockByProductId");
/* const getAllPurchases = require("../controllers/User/getAllPurchases"); */
const addToCart = require("../controllers/Carrito/addToCart");
const getShoppingCart = require("../controllers/Carrito/getShoppingCart");
const deleteProduct = require("../controllers/Carrito/deleteProductController");
const postReview = require("../controllers/reviews/postReview");
const putReview = require("../controllers/reviews/putReview");
const getReview = require("../controllers/reviews/getReview");
const getCategory = require("../controllers/product/getCategory");
const getSubcategory = require("../controllers/product/getSubCategory");
const PostRecoverPassword = require("../controllers/User/postRecoverPassword");
const PostUpdatePassword = require("../controllers/User/postUpdatePassword");

const postShoppingProduct = require("../controllers/Cart/postShoppingProduct");
const putShoppingProduct = require("../controllers/Cart/putShoppingProduct");
const deleteShoppingProduct = require("../controllers/Cart/deleteShoppingProduct");
const putAllCart = require("../controllers/Cart/putAllCart");
/* const getUserCart = require("../controllers/Cart/getUserCart"); */

const postOrder = require("../controllers/Order/postOrder");
const captureUserOrder = require("../controllers/Order/captureUserOrder");

const {
  authenticateToken,
  getClienteSoportesTecnicos,
  getClienteSoporteTecnicoDetail,
} = require("../controllers/SoporteTecnico/SoporteTecnicoClient");

router.get(
  "/soportetecnicocliente",
  authenticateToken,
  getClienteSoportesTecnicos
);
router.get(
  "/soportetecnicocliente/:id",
  authenticateToken,
  getClienteSoporteTecnicoDetail
);

// Nuevo carrito rutas
router.post("/postShoppingProduct", postShoppingProduct);
router.put("/putShoppingProduct", putShoppingProduct);
router.put("/putAllCart", putAllCart);
router.delete("/deleteShoppingProduct", deleteShoppingProduct);
/* router.get("/getUserCart", getUserCart); */

// Nuevas órdenes
router.post("/postOrder", postOrder);
router.get("/captureUserOrder", captureUserOrder);

// Rutas de Productos
router.get("/product", getProduct);
router.get("/products/search", searchProducts);
router.get("/product/:id", getProductByPk);
router.get("/property", getProperty);
router.get("/product/discount", getDiscountProducts);
router.get("/product/orderBy", getProductOrderBy);
router.get("/product/brands", getBrands);
router.get("/product/category", getCategory);
router.get("/product/sub-category", getSubcategory);

router.post("/product", postProduct);
router.delete("/product/:id", deleteProductByPk);
router.put("/product/:id", putProductbyID);
router.get("/products/:productId/images", getProductImages);
router.get("/products/:productId/imagesHome", getImagesHome);
/* router.post("/products/:productId/images", upload.array('images'), postProductImages); */

router.post("/condition", postCondition);
router.get("/condition", getAllConditions);
router.delete("/condition/:id", deleteCondition);
router.put("/condition/:id", putConditionByID);
/* 
router.put('/products/:id/status', updateProductStatus); */

// Rutas de Usuarios
router.post("/userRegister", postRegister);
router.post("/google", PostRegisterGoogle);
router.post("/login", postLogin);
router.post("/password-recover", PostRecoverPassword);
router.post("/password-update", PostUpdatePassword);
router.post("/userAdmin", createUserAdmin);
router.post("/validateUserAdmin", validateUserAdmin);
router.delete("/deleteUserAdmin/:id", deleteUserAdmin);
router.put("/updateUserAdmin/:id", updateUserAdmin);
router.get("/getAllUserAdmins", getAllUserAdmins);

router.post("/createCategory", createCategory);
router.get("/getAllCategories", getAllCategories);
router.get("/getCategoryById/:id", getCategoryById);
router.put("/updateCategory/:id", updateCategory);
router.delete("/deleteCategory/:id", deleteCategory);

router.post("/createBrand", createBrand);
router.get("/getAllBrands", getAllBrands);
router.get("/getBrandById/:id", getBrandById);
router.put("/updateBrand/:id", updateBrand);
router.delete("/deleteBrand/:id", deleteBrand);

router.put("/user/:id", putUserById);
router.put("/user/:id/password", putPassword);

/* router.get("/user/:id", getUser);
router.get("/user", getUserByEmail); */
router.get("/users", getAllUsers);
// Obtener un usuario por ID
router.get("/users/:id", getUserById);

// Crear un nuevo usuario
router.post("/users", createUser);

// Actualizar un usuario existente
router.put("/users/:id", updateUser);

// Eliminar un usuario
router.delete("/users/:id", deleteUser);
router.get("/purchases/:id", getAllPurchases);

// Rutas para tamaños
router.post("/createCapacities", createCapacity);
router.get("/getAllCapacities", getAllCapacities);
router.get("/getCapacitiesById/:id", getCapacityById);
router.put("/updateCapacities/:id", updateCapacity);
router.delete("/deleteCapacities/:id", deleteCapacity);

router.post("/createSubcategories", createSubcategory);
router.get("/getAllSubcategories", getAllSubcategories);
router.get("/getSubcategoriesById/:id", getSubcategoryById);
router.put("/updateSubcategories/:id", updateSubcategory);
router.delete("/deleteSubcategories/:id", deleteSubcategory);

router.post("/color", createColor);
router.get("/colors", getAllColors);
router.get("/color/:id", getColorById);
router.put("/color/:id", updateColor);
router.delete("/color/:id", deleteColor);
router.get(
  "/products/category/:category/subcategory/:subcategory",
  getProductByCategoryAndSubcategory
);
router.get(
  "/products/category/:category/subcategory/:subcategory/name/:name",
  getProductByCategorySubcategoryAndProductName
);
router.get(
  "/products/category/:category/subcategory/:subcategory/item/:itemId",
  getProductByItemId
);
router.get("/products/recent", getRecentProducts);

// Rutas de Favoritos
router.post("/postFavorite", postFavorite);
router.delete("/deleteFavorite", deleteFavorite);
router.get("/getAllFavorites", getAllFavorites);
router.get("/getFavsByProduct", getFavsByProduct);
router.get("/setFavoritesByUser", setFavoritesByUser);
router.get("/getOneFavByUser", getOneFavByUser);

// Rutas de Carrito
router.post("/shoppingCart", postShopping);

router.put("/shopping", putShopping);

router.post("/addToCart", addToCart);

router.get("/shoppingCart/:id", getShoppingCart);

router.delete("/shoppingCart", deleteProduct);

// Rutas PayPal
router.post("/create-order", createOrder);
router.get("/capture-order", captureOrder);
router.get("/cancel-order", cancelOrder);

//Rutas Stock
router.get("/stock/:productId", getStock);

//Rutas Reviews
router.post("/reviews", postReview);
router.put("/reviews", putReview);
router.get("/reviews", getReview);

module.exports = router;
