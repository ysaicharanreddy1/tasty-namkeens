/**
 * orderController.js – Wholesale Order Controller
 *
 * SUPERMARKET routes:
 *   POST /api/orders              → Place a new wholesale order
 *   GET  /api/orders/my-orders    → Get own order history
 *
 * ADMIN routes:
 *   GET  /api/orders              → View ALL orders (with filters)
 *   PUT  /api/orders/:id/status   → Update order status
 */

const Order = require('../models/Order');
const Product = require('../models/Product');

// ── POST /api/orders – Place a new order ──────────────────────────────────
exports.placeOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.',
      });
    }

    // Build order items with price snapshots
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.productId}" not found or is no longer available.`,
        });
      }

      if (item.quantity < product.minOrderQty) {
        return res.status(400).json({
          success: false,
          message: `Minimum order for "${product.name}" is ${product.minOrderQty} packets.`,
        });
      }

      orderItems.push({
        product: product._id,
        productName: product.name,
        netWeight: product.netWeight,
        quantity: item.quantity,
        priceAtOrder: product.wholesalePrice,
      });
    }

    const order = await Order.create({
      supermarket: req.user._id,
      supermarketName: req.user.name,
      items: orderItems,
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Admin will review and confirm shortly.',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders/my-orders – Supermarket's own orders ─────────────────
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ supermarket: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name imageUrl');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/orders – Admin: All orders ───────────────────────────────────
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('supermarket', 'name email phone'),
      Order.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/orders/:id/status – Admin: Update order status ──────────────
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;

    const validStatuses = ['Approved', 'Dispatched', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, adminNote, statusUpdatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('supermarket', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};
