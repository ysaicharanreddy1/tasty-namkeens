/**
 * storeRoutes.js – Store / Supermarket Location Routes
 *
 * Public:     GET /api/stores, /api/stores/:id
 * Admin-only: POST, PUT, DELETE /api/stores
 *             PATCH /api/stores/:id/products  → Assign/remove products from a store
 */

const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

// ── GET /api/stores – Public: List all active stores ─────────────────────
router.get('/', async (req, res, next) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };

    const stores = await Store.find(filter)
      .select('-userRef -__v')
      .populate('activeSnacks', 'name category imageUrl');

    res.status(200).json({ success: true, count: stores.length, data: stores });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/stores/:id – Public: Single store detail ────────────────────
router.get('/:id', async (req, res, next) => {
  try {
    const store = await Store.findOne({ _id: req.params.id, isActive: true })
      .populate('activeSnacks', 'name category netWeight imageUrl');

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    res.status(200).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/stores – Admin: Create a store ─────────────────────────────
router.post('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const store = await Store.create(req.body);
    res.status(201).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
});

// ── PUT /api/stores/:id – Admin: Update a store ───────────────────────────
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    res.status(200).json({ success: true, data: store });
  } catch (error) {
    next(error);
  }
});

// ── PATCH /api/stores/:id/products – Admin: Map products ↔ store ──────────
// Body: { productIds: [...], action: 'add' | 'remove' }
router.patch('/:id/products', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { productIds, action } = req.body;

    if (!['add', 'remove'].includes(action)) {
      return res.status(400).json({ success: false, message: 'action must be "add" or "remove"' });
    }

    const store = await Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    if (action === 'add') {
      // Add to store's snack list
      store.activeSnacks = [...new Set([...store.activeSnacks.map(String), ...productIds])];
      // Also add store to each product's availableStores
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $addToSet: { availableStores: store._id } }
      );
    } else {
      // Remove from store's snack list
      store.activeSnacks = store.activeSnacks.filter(
        (id) => !productIds.includes(String(id))
      );
      // Remove store from each product's availableStores
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $pull: { availableStores: store._id } }
      );
    }

    await store.save();

    res.status(200).json({
      success: true,
      message: `Products ${action === 'add' ? 'added to' : 'removed from'} store successfully.`,
      data: store,
    });
  } catch (error) {
    next(error);
  }
});

// ── DELETE /api/stores/:id – Admin: Soft-delete a store ──────────────────
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found.' });
    }

    res.status(200).json({ success: true, message: 'Store deactivated successfully.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
