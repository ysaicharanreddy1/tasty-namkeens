/**
 * Order.js – Mongoose Schema for Wholesale Bulk Orders
 *
 * Orders are placed ONLY by authenticated supermarket users.
 * Each order contains one or more line items (product + quantity).
 *
 * Order lifecycle:
 *   Pending → Approved → Dispatched → Delivered
 *   (Admin manages status transitions from the dashboard)
 */

const mongoose = require('mongoose');

// ── Sub-schema: Individual line item within an order ────────────────────────
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },

    productName: {
      type: String,
      required: true, // Snapshot at order time – preserves history if product is renamed
    },

    netWeight: {
      type: String, // Snapshot
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },

    // Price at the time of ordering (snapshot – protects against future price changes)
    priceAtOrder: {
      type: Number,
      required: [true, 'Price at order time is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false }
);

// ── Main Order Schema ────────────────────────────────────────────────────────
const orderSchema = new mongoose.Schema(
  {
    // The supermarket that placed this order
    supermarket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Supermarket reference is required'],
    },

    // Snapshot of the supermarket name for quick display
    supermarketName: {
      type: String,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (val) => val.length > 0,
        message: 'An order must contain at least one item',
      },
    },

    // Total value of the order (calculated before saving)
    totalAmount: {
      type: Number,
      default: 0,
      min: [0, 'Total amount cannot be negative'],
    },

    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Dispatched', 'Delivered', 'Cancelled'],
        message: 'Invalid order status',
      },
      default: 'Pending',
    },

    // Admin notes (e.g., expected delivery date, rejection reason)
    adminNote: {
      type: String,
      trim: true,
      maxlength: [500, 'Admin note cannot exceed 500 characters'],
    },

    // When the admin approved/dispatched/delivered the order
    statusUpdatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt = order placement time
  }
);

// ── Pre-save hook: Calculate totalAmount from items ──────────────────────────
orderSchema.pre('save', function (next) {
  if (this.isModified('items') || this.isNew) {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.priceAtOrder * item.quantity,
      0
    );
  }
  next();
});

// ── Indexes for dashboard performance ────────────────────────────────────────
orderSchema.index({ supermarket: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
