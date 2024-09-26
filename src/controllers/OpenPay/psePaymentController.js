// controllers/psePaymentController.js
const { createPseCharge } = require('../../openpay');

const handlePsePayment = async (req, res) => {
  try {
    const { customer, charge } = req.body; // Obtener datos del cliente y del cargo desde el cuerpo de la solicitud

    // Crear el cargo PSE utilizando el servicio
    const paymentResponse = await createPseCharge(customer, charge);

    // Enviar respuesta al cliente con los detalles del cargo
    res.status(200).json({
      message: 'Cargo PSE creado con éxito',
      paymentResponse,
    });
  } catch (error) {
    // Manejar errores y enviar respuesta al cliente
    res.status(500).json({
      message: 'Error al procesar el pago PSE',
      error: error.response ? error.response.data : error.message,
    });
  }
};

module.exports = { handlePsePayment };
