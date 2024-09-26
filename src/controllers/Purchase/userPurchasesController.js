const { User, Purchase } = require('../../db');

const getPurchasesByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Solicitud recibida para userId:', userId);

    // Verificar si el usuario existe
    const user = await User.findByPk(userId);

    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'User not found' });
    }

    // Encontrar las compras asociadas al usuario usando el userId
    const purchases = await Purchase.findAll({
      where: { userId },
      attributes: ['id', 'amount', 'currency', 'description', 'status', 'payment_method', 'customer_name', 'customer_email', 'reference', 'charge_id', 'createdAt'] // Incluir createdAt
    });

    console.log('Compras encontradas:', purchases.length);

    if (purchases.length === 0) {
      return res.status(404).json({ message: 'No purchases found for this user' });
    }

    // Devolver las compras con createdAt incluido
    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error en getPurchasesByUserId:', error);
    res.status(500).json({ message: 'Error retrieving purchases' });
  }
};

module.exports = {
  getPurchasesByUserId,
};
