const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login
router.get('/login', (req, res) => res.render('auth/login', { error: req.authError }));
router.post('/login', authController.login);

module.exports = router;
