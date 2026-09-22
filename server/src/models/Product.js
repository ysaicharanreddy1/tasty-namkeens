/**
 * Product.js – Mongoose Schema for Snack Products
 *
 * Each product represents a single snack variety in the catalog.
 * - Public users see: name, category, description, netWeight, imageUrl, availableStores
 * - Authenticated supermarkets also see: wholesalePrice, minOrderQty
 * - availableStores is an array of Store ObjectIds (populated on demand)
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Namkeens',
          'Bhujia',
          'Chivda',
          'Chips',
          'Peanuts',
          'Lentil Snacks',
          'Mathri',
          'Mixture',
          'Biscuits & Cookies',
          'Chikki',
          'Laddu',
          'Chakli',
          'Murukku',
          'Roasted Snacks',
          'Mixed Snacks',
          'Peanut Snacks',
          'Other',
        ],
        message: 'Invalid category',
      },
    },

    netWeight: {
      type: String, // e.g., "200g", "500g", "1kg"
      required: [true, 'Net weight is required'],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },

    ingredients: {
      type: String,
      trim: true,
    },

    // MRP (Maximum Retail Price) – public-facing retail price
    mrp: {
      type: Number,
      min: [0, 'MRP cannot be negative'],
    },

    // B2B-only field – hidden from public API responses
    wholesalePrice: {
      type: Number,
      required: [true, 'Wholesale price is required'],
      min: [0, 'Price cannot be negative'],
    },

    // Minimum packets a supermarket must order per line item
    minOrderQty: {
      type: Number,
      required: [true, 'Minimum order quantity is required'],
      min: [1, 'Minimum order quantity must be at least 1'],
      default: 10,
    },

    imageUrl: {
      type: String,
      default: '/images/placeholder-snack.png',
      trim: true,
    },

    // Array of Store ObjectIds that stock this product
    availableStores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
      },
    ],

    // Allow admin to hide a product without deleting it
    isActive: {
      type: Boolean,
      default: true,
    },

    // SEO-friendly slug (e.g., "aloo-bhujia-200g")
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Pre-save hook: Auto-generate slug from name + netWeight ─────────────────
productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isModified('netWeight')) {
    this.slug = `${this.name}-${this.netWeight}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// ── Index for faster public catalog queries ─────────────────────────────────
productSchema.index({ category: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
