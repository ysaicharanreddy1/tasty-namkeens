/**
 * productController.js – Product Catalog Controller
 *
 * PUBLIC routes (no auth required):
 *   GET  /api/products              → List all active products (no wholesale price)
 *   GET  /api/products/:id          → Get single product details + available stores
 *   GET  /api/products/:id/stores   → Get stores carrying a specific product
 *
 * PROTECTED routes (supermarket + admin):
 *   GET  /api/products/wholesale    → Full catalog WITH wholesale pricing
 *
 * ADMIN-ONLY routes:
 *   POST   /api/products            → Create new product
 *   PUT    /api/products/:id        → Update product
 *   DELETE /api/products/:id        → Soft-delete (sets isActive = false)
 */

const Product = require('../models/Product');

// ── Fields hidden from public API responses ────────────────────────────────
const PUBLIC_FIELDS = '-wholesalePrice -minOrderQty';

// ── GET /api/products ──────────────────────────────────────────────────────
exports.getPublicProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .select(PUBLIC_FIELDS)
      .sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id ──────────────────────────────────────────────────
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    })
      .select(PUBLIC_FIELDS)
      .populate({
        path: 'availableStores',
        select: 'storeName address phone whatsappNumber openingHours isActive',
        match: { isActive: true },
      });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/:id/stores ──────────────────────────────────────────
exports.getStoresForProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate({
      path: 'availableStores',
      select: 'storeName address phone whatsappNumber openingHours',
      match: { isActive: true },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({
      success: true,
      productName: product.name,
      count: product.availableStores.length,
      stores: product.availableStores,
    });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/products/wholesale (protected: supermarket + admin) ───────────
exports.getWholesaleProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      category: 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/products (admin only) ───────────────────────────────────────
exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/products/:id (admin only) ────────────────────────────────────
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/products/:id (admin only – soft delete) ───────────────────
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully.',
    });
  } catch (error) {
    next(error);
  }
};
