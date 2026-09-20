/**
 * authRoutes.js – Authentication Routes
 */

const express = require('express');
const router = express.Router();

const { login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// GET  /api/auth/me  (requires valid JWT)
router.get('/me', protect, getMe);

// POST /api/auth/logout
router.post('/logout', protect, logout);

module.exports = router;
