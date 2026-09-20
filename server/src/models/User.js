/**
 * User.js – Mongoose Schema for Users (Admin & Supermarket accounts)
 *
 * Roles:
 *   'admin'       – Master admin who manages everything
 *   'supermarket' – Verified supermarket account that can place wholesale orders
 *
 * Password hashing is handled via a pre-save hook using bcryptjs.
 * Plain-text passwords are NEVER stored in the database.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email address',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in query results by default
    },

    role: {
      type: String,
      enum: {
        values: ['admin', 'supermarket'],
        message: 'Role must be either "admin" or "supermarket"',
      },
      default: 'supermarket',
    },

    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },

    whatsappNumber: {
      type: String,
      trim: true,
    },

    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },

    // Admin can deactivate a supermarket account without deleting it
    isActive: {
      type: Boolean,
      default: true,
    },

    // Reference to the Store document associated with this supermarket
    storeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Pre-save hook: Hash password before saving ─────────────────────────────
userSchema.pre('save', async function (next) {
  // Only hash when the password field is new or modified
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: Compare entered password with stored hash ─────────────
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Virtual: Full address string ───────────────────────────────────────────
userSchema.virtual('fullAddress').get(function () {
  const a = this.address;
  if (!a) return '';
  return [a.street, a.city, a.state, a.pincode].filter(Boolean).join(', ');
});

const User = mongoose.model('User', userSchema);
module.exports = User;
