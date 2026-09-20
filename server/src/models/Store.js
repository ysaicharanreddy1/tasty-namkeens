/**
 * Store.js – Mongoose Schema for Physical Supermarket / Store Locations
 *
 * Each Store represents a verified physical retail location that:
 *   1. Is visible to public users on the "Find Nearby Store" feature
 *   2. Has an associated User account (supermarket role) for placing B2B orders
 *   3. Stocks a specific subset of Tasty Namkeens products
 */

const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: [true, 'Store name is required'],
      trim: true,
      maxlength: [150, 'Store name cannot exceed 150 characters'],
    },

    ownerName: {
      type: String,
      trim: true,
    },

    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true,
      },
      landmark: { type: String, trim: true },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
        match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
      },
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'],
    },

    // WhatsApp contact for the store (may differ from phone)
    whatsappNumber: {
      type: String,
      trim: true,
    },

    // GeoJSON Point location (optional – for future map feature)
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },

    // Products currently stocked by this store
    activeSnacks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

    // Link to the User (supermarket account) that manages this store
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Optional: opening hours, store image, etc. (future expansion)
    openingHours: {
      type: String,
      trim: true,
      default: 'Mon–Sun: 9:00 AM – 9:00 PM',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Virtual: Full address string ────────────────────────────────────────────
storeSchema.virtual('fullAddress').get(function () {
  const a = this.address;
  return [a.street, a.landmark, a.city, a.state, a.pincode]
    .filter(Boolean)
    .join(', ');
});

// ── Index for geospatial queries (future "find stores near me" feature) ──────
storeSchema.index({ location: '2dsphere' }, { sparse: true });
storeSchema.index({ 'address.city': 1, isActive: 1 });

const Store = mongoose.model('Store', storeSchema);
module.exports = Store;
