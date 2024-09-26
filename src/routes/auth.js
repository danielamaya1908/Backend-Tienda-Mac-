const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User, Purchase, Product, Image } = require("../db");

// Middleware para verificar el token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No hay token, autorización denegada' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('Token no válido:', err.message);
    res.status(401).json({ msg: 'Token no válido' });
  }
};

// Ruta POST para registro de usuarios
router.post('/register', [
  check('firstName', 'El nombre es requerido').trim().not().isEmpty(),
  check('email', 'Por favor, ingresa un correo electrónico válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
  check('documentNumber', 'El número de documento es requerido').trim().not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, documentNumber, phoneNumber, address, city, country, zipCode } = req.body;

  try {
    let user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).json({ msg: 'El usuario ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      documentNumber,
      phoneNumber,
      address,
      city,
      country,
      zipCode
    });

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        rol: user.rol,
        documentNumber,
        phoneNumber,
        address,
        city,
        country,
        zipCode
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (error, token) => {
      if (error) throw error;
      res.status(201).json({ 
        msg: 'Registro exitoso',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
          rol: user.rol,
          documentNumber,
          phoneNumber,
          address,
          city,
          country,
          zipCode
        }
      });
    });
  } catch (error) {
    console.error('Error en el registro:', error.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta POST para inicio de sesión
router.post('/LoginUser', [
  check('email', 'Por favor, ingresa un correo electrónico válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña es requerida').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        rol: user.rol,
        documentNumber: user.documentNumber,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        country: user.country,
        zipCode: user.zipCode
      }
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (error, token) => {
      if (error) throw error;
      res.json({ 
        msg: 'Inicio de sesión exitoso',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          email: user.email,
          rol: user.rol,
          documentNumber: user.documentNumber,
          phoneNumber: user.phoneNumber,
          address: user.address,
          city: user.city,
          country: user.country,
          zipCode: user.zipCode
        }
      });
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta GET para obtener información del usuario autenticado
router.get('/me', auth, async (req, res) => {
  console.log('User ID:', req.user.id);  // Verifica si el ID del usuario se pasa correctamente
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'rol', 'documentNumber', 'phoneNumber', 'address', 'city', 'country', 'zipCode'] // Campos del modelo
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error al obtener información del usuario:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Nueva ruta PUT para actualizar la información del usuario
router.put('/me', auth, [
  check('firstName', 'El nombre es requerido').trim().not().isEmpty(),
  check('email', 'Por favor, ingresa un correo electrónico válido').isEmail().normalizeEmail(),
  check('documentNumber', 'El número de documento es requerido').trim().not().isEmpty(),
  check('address', 'La dirección es requerida').trim().not().isEmpty(),
  check('city', 'La ciudad es requerida').trim().not().isEmpty(),
  check('country', 'El país es requerido').trim().not().isEmpty(),
  check('zipCode', 'El código postal es requerido').isNumeric(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, documentNumber, phoneNumber, address, city, country, zipCode } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    await user.update({
      firstName,
      lastName,
      email,
      documentNumber,
      phoneNumber,
      address,
      city,
      country,
      zipCode
    });

    res.json({ msg: 'Información del usuario actualizada', user });
  } catch (err) {
    console.error('Error al actualizar la información del usuario:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Nueva ruta GET para obtener detalles de la cuenta del usuario
router.get('/account', auth, async (req, res) => {
  console.log('User ID en /account:', req.user.id);  // Verifica si el ID del usuario se pasa correctamente
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'rol', 'createdAt', 'updatedAt', 'documentNumber', 'phoneNumber', 'address', 'city', 'country', 'zipCode'] // Campos del modelo
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error al obtener detalles de la cuenta del usuario:', err.message);
    res.status(500).send('Error del servidor');
  }
});

// Nueva ruta POST para cerrar sesión
router.post('/logout', auth, (req, res) => {
  res.json({ msg: 'Sesión cerrada exitosamente' });
});

// Ruta GET para obtener las compras del usuario autenticado, con información del producto
router.get('/purchases', auth, async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      attributes: [
        'id', 
        'amount', 
        'currency', 
        'description', 
        'status', 
        'payment_method', 
        'customer_name', 
        'customer_email', 
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

    res.json(purchases);
  } catch (err) {
    console.error('Error al obtener las compras:', err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
