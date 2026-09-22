/**
 * adminRoutes.js – Admin-only Management Routes
 *
 * GET  /api/admin/users             → List all supermarket accounts
 * POST /api/admin/users             → Create a supermarket account (no public signup)
 * PUT  /api/admin/users/:id         → Update user details
 * PATCH /api/admin/users/:id/toggle → Toggle active/inactive status
 * GET  /api/admin/dashboard         → Summary stats (orders, products, stores)
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const { protect, authorize } = require('../middleware/auth');

// All routes in this file require admin authentication
router.use(protect, authorize('admin'));

// ── GET /api/admin/dashboard ──────────────────────────────────────────────
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalStores,
      totalOrders,
      pendingOrders,
      totalSupermarkets,
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Store.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'Pending' }),
      User.countDocuments({ role: 'supermarket', isActive: true }),
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('supermarket', 'name email');

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalStores,
        totalOrders,
        pendingOrders,
        totalSupermarkets,
      },
      recentOrders,
    });
  } catch (error) {
    next(error);
  }
});

// ── GET /api/admin/users ───────────────────────────────────────────────────
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'supermarket' })
      .populate('storeRef', 'storeName address.city')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
});

// ── POST /api/admin/users – Create supermarket account ───────────────────
router.post('/users', async (req, res, next) => {
  try {
    const { name, username, email, password, phone, whatsappNumber, address, storeRef } = req.body;

    const user = await User.create({
      name,
      username: (username || email || name.replace(/\s+/g, '').toLowerCase()),
      email: email || '',
      password,
      phone,
      whatsappNumber,
      address,
      storeRef: storeRef || null,
      role: 'supermarket',
    });

    // Don't send password back
    user.password = undefined;

    res.status(201).json({
      success: true,
      message: 'Supermarket account created successfully.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

// ── PUT /api/admin/users/:id – Update user details ────────────────────────
router.put('/users/:id', async (req, res, next) => {
  try {
    // Prevent role escalation via this endpoint
    delete req.body.role;
    delete req.body.password; // Use a dedicated change-password route

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// ── PATCH /api/admin/users/:id/toggle – Toggle active status ─────────────
router.patch('/users/:id/toggle', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role === 'admin') {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Account ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: { id: user._id, isActive: user.isActive },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
