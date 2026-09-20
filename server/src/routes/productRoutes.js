/**
 * productRoutes.js – Product Catalog Routes
 *
 * Public:     GET /api/products, /api/products/:id, /api/products/:id/stores
 * Protected:  GET /api/products/wholesale
 * Admin-only: POST, PUT, DELETE /api/products
 */

const express = require('express');
const router = express.Router();

const {
  getPublicProducts,
  getProductById,
  getStoresForProduct,
  getWholesaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

const { protect, authorize } = require('../middleware/auth');

// ── Public routes ─────────────────────────────────────────────────────────
router.get('/', getPublicProducts);
router.get('/wholesale', protect, authorize('admin', 'supermarket'), getWholesaleProducts);
router.get('/:id/stores', getStoresForProduct);
router.get('/:id', getProductById);

// ── Admin-only routes ─────────────────────────────────────────────────────
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
