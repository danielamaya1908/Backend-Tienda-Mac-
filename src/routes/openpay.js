
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { Purchase } = require("../db"); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Tus credenciales de Openpay
const MERCHANT_ID = process.env.MERCHANT_ID;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Crear un cliente de Axios configurado para Openpay
const openpayClient = axios.create({
  baseURL: `https://api.openpay.co/v1/${MERCHANT_ID}`,
  auth: {
    username: PRIVATE_KEY,
    password: '', // La contraseña está vacía
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para crear un cargo en tienda
const createStoreCharge = async (chargeData) => {
  try {
    const response = await openpayClient.post('/charges', chargeData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el cargo en tienda:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Función para almacenar una compra
const storePurchase = async (purchaseData) => {
  try {
    await Purchase.create(purchaseData);
  } catch (error) {
    console.error('Error al almacenar la compra:', error.message);
    throw error;
  }
};

// Función para actualizar el estado de una compra
const updatePurchaseStatus = async (purchaseId, status) => {
  try {
    await Purchase.update({ status }, {
      where: { charge_id: purchaseId },
    });
  } catch (error) {
    console.error('Error al actualizar el estado de la compra:', error.message);
    throw error;
  }
};

// Ruta para procesar el pago en tienda
router.post('/store-payment', async (req, res) => {
  try {
    const { customer, charge, userId, productId } = req.body;

    // Validación de datos
    if (!charge.amount || charge.amount <= 0) {
      return res.status(400).json({ error: 'El monto debe ser mayor a cero' });
    }

    if (!charge.description) {
      return res.status(400).json({ error: 'El concepto es obligatorio' });
    }

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId y productId son obligatorios' });
    }

    // Preparar datos del cargo
    const chargeData = {
      method: 'store',
      amount: charge.amount,
      currency: 'COP',
      description: charge.description,
      order_id: charge.order_id,
      iva: charge.iva || 0,
      customer: {
        name: customer.name,
        last_name: customer.last_name,
        email: customer.email,
        phone_number: customer.phone_number,
        customer_address: {
          department: customer.department,
          city: customer.city,
          additional: customer.additional,
        },
      },
    };

    // Crear el cargo
    const result = await createStoreCharge(chargeData);

    // Generar el enlace del recibo de pago
    const receiptUrl = `https://sandbox-dashboard.openpay.co/paynet-pdf/${MERCHANT_ID}/${result.payment_method.reference}`;

    // Almacenar la compra en la base de datos
    const purchaseData = {
      amount: result.amount,
      currency: result.currency,
      description: result.description,
      status: result.status,
      payment_method: result.method,
      customer_name: `${result.customer.name} ${result.customer.last_name}`,
      customer_email: result.customer.email,
      customer_phone: result.customer.phone_number,
      customer_city: result.customer.customer_address.city,
      customer_department: result.customer.customer_address.department,
      customer_address: result.customer.customer_address.additional,
      reference: result.id,
      charge_id: result.id,
      userId,
      productId,
      customer_document_number: customer.document_number,
    };
    await storePurchase(purchaseData);

    // Devolver el resultado junto con el enlace del recibo
    res.status(200).json({
      message: 'Cargo creado exitosamente',
      reference: result.payment_method.reference,
      receipt_url: receiptUrl,
    });
  } catch (error) {
    console.error('Error en el controlador de pago en tienda:', error.message);
    res.status(500).json({ error: 'Error al procesar el pago en tienda' });
  }
});

// Función para crear un cargo PSE
const createPseCharge = async (chargeData, customerData = null, customerId = null) => {
  try {
    let endpoint = '/charges';
    let payload = {
      method: 'bank_account',
      amount: chargeData.amount,
      currency: 'COP',
      description: chargeData.description,
      order_id: chargeData.order_id,
      iva: chargeData.iva || 0,
      redirect_url: chargeData.redirect_url || '',
    };

    if (customerId) {
      endpoint = `/customers/${customerId}/charges`;
    } else if (customerData) {
      payload.customer = {
        name: customerData.name,
        last_name: customerData.last_name,
        email: customerData.email,
        phone_number: customerData.phone_number,
        requires_account: false,
        customer_address: {
          department: customerData.department,
          city: customerData.city,
          additional: customerData.additional,
        },
      };
    }

    const response = await openpayClient.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error al crear el cargo PSE:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Ruta para procesar el pago PSE
router.post('/pse-payment', async (req, res) => {
  try {
    const { customer, charge, customer_id, userId, productId } = req.body;

    let result;
    if (customer_id) {
      result = await createPseCharge(charge, null, customer_id);
    } else {
      result = await createPseCharge(charge, customer);
    }

    // Validar campos adicionales
    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId y productId son obligatorios' });
    }

    // Almacenar la compra en la base de datos
    const purchaseData = {
      amount: result.amount,
      currency: result.currency,
      description: result.description,
      status: result.status,
      payment_method: result.method,
      customer_name: `${result.customer.name} ${result.customer.last_name}`,
      customer_email: result.customer.email,
      customer_phone: result.customer.phone_number,
      customer_city: result.customer.customer_address.city,
      customer_department: result.customer.customer_address.department,
      customer_address: result.customer.customer_address.additional,
      reference: result.id,
      charge_id: result.id,
      userId,
      productId,
      customer_document_number: customer.document_number,
    };
    await storePurchase(purchaseData);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error en el controlador de pago PSE:', error.message);
    res.status(500).json({ error: 'Error al procesar el pago PSE' });
  }
});

// Función para crear un cargo
const createCharge = async (chargeData) => {
  try {
    const response = await openpayClient.post('/charges', chargeData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el cargo:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// Ruta para crear un cargo
router.post('/create-charge', async (req, res) => {
  try {
    const { method, amount, currency, description, customer, confirm, send_email, redirect_url, userId, productId } = req.body;

    // Validación básica de datos
    if (!method || !amount || !currency || !description || !customer) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (!userId || !productId) {
      return res.status(400).json({ error: 'userId y productId son obligatorios' });
    }

    const chargeData = {
      method,
      amount,
      currency: currency || 'COP',
      description,
      customer,
      confirm: confirm || "false",
      send_email: send_email || "true",
      redirect_url: redirect_url || 'http://www.google.com',
    };

    console.log('Datos del cargo:', chargeData); // Para depuración

    const result = await createCharge(chargeData);

    // Almacenar la compra en la base de datos
    const purchaseData = {
      amount: result.amount,
      currency: result.currency,
      description: result.description,
      status: result.status,
      payment_method: result.method,
      customer_name: `${result.customer.name} ${result.customer.last_name}`,
      customer_email: result.customer.email,
      customer_phone: result.customer.phone_number,
      customer_city: result.customer.customer_address.city,
      customer_department: result.customer.customer_address.department,
      customer_address: result.customer.customer_address.additional,
      reference: result.id,
      charge_id: result.id,
      userId,
      productId,
      customer_document_number: customer.document_number,
    };
    await storePurchase(purchaseData);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error en el controlador de cargo:', error); // Para depuración
    const statusCode = error.response ? error.response.status : 500;
    res.status(statusCode).json({
      error: error.response ? error.response.data : 'Error desconocido al crear el cargo',
    });
  }
});

// Ruta para confirmar un pago
router.get('/confirm-payment/:chargeId', async (req, res) => {
  try {
    const { chargeId } = req.params;

    // Validar el chargeId
    if (!chargeId) {
      return res.status(400).json({ error: 'Falta el chargeId' });
    }

    const response = await openpayClient.get(`/charges/${chargeId}`);
    const charge = response.data;

    // Actualizar el estado de la compra en la base de datos
    await updatePurchaseStatus(chargeId, charge.status);

    res.status(200).json(charge);
  } catch (error) {
    console.error('Error al confirmar el pago:', error.message);
    res.status(500).json({ error: 'Error al confirmar el pago' });
  }
});

module.exports = router;