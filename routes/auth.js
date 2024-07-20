const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register
router.get('/register', (req, res) => res.render('auth/register'));
router.post('/register', authController.register);

// Login
router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;