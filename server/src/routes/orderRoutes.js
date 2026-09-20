/**
 * orderRoutes.js – Wholesale Order Routes
 *
 * Supermarket: POST /api/orders, GET /api/orders/my-orders
 * Admin:       GET  /api/orders, PUT /api/orders/:id/status
 */

const express = require('express');
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const { protect, authorize } = require('../middleware/auth');

// Supermarket: place order
router.post('/', protect, authorize('supermarket'), placeOrder);

// Supermarket: view own orders
router.get('/my-orders', protect, authorize('supermarket'), getMyOrders);

// Admin: view all orders
router.get('/', protect, authorize('admin'), getAllOrders);

// Admin: update order status
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

module.exports = router;
