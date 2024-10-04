const { Purchase, User, Product, Image } = require("../../db");

// Crear una nueva compra
const createPurchase = async (req, res) => {
  try {
    const { amount, currency, description, status, payment_method, customer_name, customer_email, reference, charge_id, userId, productId } = req.body;

    // Validar campos requeridos
    if (!amount || !currency || !description || !status || !payment_method || !customer_name || !customer_email || !userId || !productId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Crear la compra
    const purchase = await Purchase.create({ amount, currency, description, status, payment_method, customer_name, customer_email, reference, charge_id, userId, productId });

    return res.status(201).json(purchase);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      attributes: [
        'id',
        'amount',
        'currency',
        'description',
        'status',
        'payment_method',
        'customer_name',
        'customer_email',
        'customer_phone', // Nuevo campo
        'customer_city',  // Nuevo campo
        'customer_department', // Nuevo campo
        'customer_address', // Nuevo campo
        'customer_document_number', // Nuevo campo
        'reference',
        'charge_id',
        'createdAt'
      ],
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'description', 'categoryId'],
        include: [{
          model: Image,
          attributes: ['id', 'path'],
        }],
      }],
    });

    res.status(200).json(purchases);
  } catch (err) {
    console.error('Error al obtener las compras:', err.message);
    res.status(500).send('Error del servidor');
  }
};

// Obtener todas las compras de un usuario específico
const getPurchasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const purchases = await Purchase.findAll({ where: { userId } });

    if (!purchases.length) {
      return res.status(404).json({ message: "No purchases found for this user" });
    }

    res.status(200).json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving purchases" });
  }
};

// Obtener una compra por ID
const getPurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    res.status(200).json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving purchase" });
  }
};

// Actualizar una compra por ID
const updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, currency, description, status, payment_method, customer_name, customer_email, reference, charge_id } = req.body;

    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Actualizar los campos de la compra
    purchase.amount = amount !== undefined ? amount : purchase.amount;
    purchase.currency = currency !== undefined ? currency : purchase.currency;
    purchase.description = description !== undefined ? description : purchase.description;
    purchase.status = status !== undefined ? status : purchase.status;
    purchase.payment_method = payment_method !== undefined ? payment_method : purchase.payment_method;
    purchase.customer_name = customer_name !== undefined ? customer_name : purchase.customer_name;
    purchase.customer_email = customer_email !== undefined ? customer_email : purchase.customer_email;
    purchase.reference = reference !== undefined ? reference : purchase.reference;
    purchase.charge_id = charge_id !== undefined ? charge_id : purchase.charge_id;

    await purchase.save();

    res.status(200).json({ message: "Purchase updated", purchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating purchase" });
  }
};

// Eliminar una compra por ID
const deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    await purchase.destroy();
    res.status(200).json({ message: "Purchase deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting purchase" });
  }
};

module.exports = {
  createPurchase,
  getAllPurchases,
  getPurchasesByUserId,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
