const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { User } = require("../db");

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
    res.status(401).json({ msg: 'Token no válido' });
  }
};

// Ruta POST para registro de usuarios
router.post('/register', [
  check('firstName', 'El nombre es requerido').trim().not().isEmpty(),
  check('lastName', 'El apellido es requerido').trim().not().isEmpty(),
  check('email', 'Por favor, ingresa un correo electrónico válido').isEmail().normalizeEmail(),
  check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password } = req.body;

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
    });

    const payload = {
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        rol: user.rol,
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
          rol: user.rol
        }
      });
    });
  } catch (error) {
    console.error(error.message);
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
          rol: user.rol
        }
      });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error del servidor');
  }
});

// Ruta GET para obtener información del usuario autenticado
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'rol']
    });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Nueva ruta GET para obtener detalles de la cuenta del usuario
router.get('/account', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'rol', 'createdAt', 'updatedAt']
    });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Nueva ruta POST para cerrar sesión
router.post('/logout', auth, (req, res) => {
  res.json({ msg: 'Sesión cerrada exitosamente' });
});

module.exports = router;