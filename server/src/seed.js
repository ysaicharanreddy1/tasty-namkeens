/**
 * seed.js – Database Seed Script
 *
 * Populates the database with:
 *   ✅ 1 Master Admin account
 *   ✅ 5 realistic Tasty Namkeens snack products
 *   ✅ 2 sample supermarket store profiles
 *   ✅ 2 supermarket user accounts linked to stores
 *   ✅ Proper Store ↔ Product cross-references
 *
 * Usage:
 *   npm run seed              → Seed the database
 *   node src/seed.js --fresh  → Drop existing data first, then seed
 *
 * ⚠️  NEVER run with --fresh in production!
 */

require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const User    = require('./models/User');
const Product = require('./models/Product');
const Store   = require('./models/Store');
const Order   = require('./models/Order');

// ── Seed Data ──────────────────────────────────────────────────────────────

const adminData = {
  name: 'Tasty Namkeens Admin',
  email: 'admin@tastynam-keens.com',
  password: 'Admin@TastyNamkeens2024', // Will be hashed by pre-save hook
  role: 'admin',
  phone: '9000000000',
  address: {
    street: 'Tasty Namkeens HQ, Industrial Area',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
  },
};

const productsData = [
  {
    name: 'Aloo Bhujia',
    category: 'Bhujia',
    netWeight: '200g',
    description:
      'Classic crispy potato bhujia seasoned with a perfect blend of spices. A timeless Indian snack loved by all ages.',
    ingredients:
      'Potato starch, besan (chickpea flour), salt, turmeric, red chilli powder, cumin, vegetable oil.',
    wholesalePrice: 55,
    minOrderQty: 20,
    imageUrl: '/images/aloo-bhujia.png',
  },
  {
    name: 'Moong Dal Namkeen',
    category: 'Lentil Snacks',
    netWeight: '250g',
    description:
      'Premium whole moong dal fried to golden perfection. Light, crunchy, and mildly spiced for a guilt-free snacking experience.',
    ingredients:
      'Moong dal, vegetable oil, salt, black pepper, asafoetida (hing), lemon powder.',
    wholesalePrice: 70,
    minOrderQty: 15,
    imageUrl: '/images/moong-dal.png',
  },
  {
    name: 'Kanda Poha Chivda',
    category: 'Chivda',
    netWeight: '300g',
    description:
      'A Maharashtrian specialty! Thin flattened rice mixed with crunchy onion, peanuts, and a blend of sweet & spicy masalas.',
    ingredients:
      'Thin poha (flattened rice), fried onion, groundnuts, curry leaves, green chilli, sugar, salt, oil.',
    wholesalePrice: 85,
    minOrderQty: 12,
    imageUrl: '/images/kanda-poha-chivda.png',
  },
  {
    name: 'Peri Peri Mathri',
    category: 'Mathri',
    netWeight: '150g',
    description:
      'Flaky, crispy wheat-flour crackers dusted with fiery peri peri seasoning. A bold twist on the traditional mathri.',
    ingredients:
      'Wheat flour (maida), vanaspati, peri peri seasoning, salt, carom seeds (ajwain), baking soda.',
    wholesalePrice: 48,
    minOrderQty: 25,
    imageUrl: '/images/peri-peri-mathri.png',
  },
  {
    name: 'Roasted Masala Peanuts',
    category: 'Peanuts',
    netWeight: '500g',
    description:
      'Jumbo-sized groundnuts dry-roasted and coated in a tangy chaat masala blend. High protein, zero guilt.',
    ingredients:
      'Groundnuts, salt, chaat masala, amchur (dry mango powder), red chilli powder, cumin powder.',
    wholesalePrice: 120,
    minOrderQty: 10,
    imageUrl: '/images/masala-peanuts.png',
  },
];

const storesData = [
  {
    storeName: 'Sri Lakshmi Supermarket',
    ownerName: 'Ravi Kumar',
    address: {
      street: '14, Main Road, Ameerpet',
      landmark: 'Near Metro Station',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500016',
    },
    phone: '9876543210',
    whatsappNumber: '919876543210',
    openingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
  },
  {
    storeName: 'Balaji General Store',
    ownerName: 'Suresh Reddy',
    address: {
      street: '7, Gandhi Nagar, Dilsukhnagar',
      landmark: 'Opposite Bus Stand',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500060',
    },
    phone: '9123456789',
    whatsappNumber: '919123456789',
    openingHours: 'Mon–Sat: 9:00 AM – 9:00 PM',
  },
];

const supermarketsData = [
  {
    name: 'Sri Lakshmi Supermarket',
    email: 'srilakshmi@example.com',
    password: 'Supermarket@123',
    role: 'supermarket',
    phone: '9876543210',
    whatsappNumber: '919876543210',
    address: {
      street: '14, Main Road, Ameerpet',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500016',
    },
  },
  {
    name: 'Balaji General Store',
    email: 'balaji@example.com',
    password: 'Supermarket@456',
    role: 'supermarket',
    phone: '9123456789',
    whatsappNumber: '919123456789',
    address: {
      street: '7, Gandhi Nagar, Dilsukhnagar',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500060',
    },
  },
];

// ── Seed Function ──────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await connectDB();

    const isFresh = process.argv.includes('--fresh');

    if (isFresh) {
      console.log('\n🗑️  --fresh flag detected. Clearing existing data...');
      await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Store.deleteMany({}),
        Order.deleteMany({}),
      ]);
      console.log('   ✅ All collections cleared.\n');
    } else {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log('\n⚠️  Database already seeded (admin account exists).');
        console.log('   Run with --fresh flag to re-seed: npm run seed -- --fresh\n');
        process.exit(0);
      }
    }

    console.log('🌱 Starting database seed...\n');

    // ── Step 1: Create Admin ─────────────────────────────────────────────
    console.log('👤 Creating admin account...');
    const admin = await User.create(adminData);
    console.log(`   ✅ Admin created: ${admin.email}`);

    // ── Step 2: Create Products ──────────────────────────────────────────
    console.log('\n🥜 Creating products...');
    const products = await Product.create(productsData);
    products.forEach((p) => console.log(`   ✅ ${p.name} (${p.netWeight})`));

    // ── Step 3: Create Stores ─────────────────────────────────────────────
    console.log('\n🏪 Creating store profiles...');

    // Store 1 → stocks all 5 products
    const store1 = await Store.create({
      ...storesData[0],
      activeSnacks: products.map((p) => p._id),
    });

    // Store 2 → stocks first 3 products only
    const store2 = await Store.create({
      ...storesData[1],
      activeSnacks: products.slice(0, 3).map((p) => p._id),
    });

    console.log(`   ✅ ${store1.storeName} (stocks ${store1.activeSnacks.length} products)`);
    console.log(`   ✅ ${store2.storeName} (stocks ${store2.activeSnacks.length} products)`);

    // ── Step 4: Update Products with Store Back-References ────────────────
    console.log('\n🔗 Mapping store references to products...');

    // All products get store1
    await Product.updateMany(
      { _id: { $in: products.map((p) => p._id) } },
      { $addToSet: { availableStores: store1._id } }
    );

    // First 3 products also get store2
    await Product.updateMany(
      { _id: { $in: products.slice(0, 3).map((p) => p._id) } },
      { $addToSet: { availableStores: store2._id } }
    );

    console.log('   ✅ Product ↔ Store cross-references set.');

    // ── Step 5: Create Supermarket User Accounts ───────────────────────────
    console.log('\n👥 Creating supermarket user accounts...');

    const sm1 = await User.create({ ...supermarketsData[0], storeRef: store1._id });
    const sm2 = await User.create({ ...supermarketsData[1], storeRef: store2._id });

    // Link users back to stores
    store1.userRef = sm1._id;
    store2.userRef = sm2._id;
    await store1.save();
    await store2.save();

    console.log(`   ✅ ${sm1.name} → email: ${sm1.email} | password: Supermarket@123`);
    console.log(`   ✅ ${sm2.name} → email: ${sm2.email} | password: Supermarket@456`);

    // ── Summary ────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n  📊 Created:`);
    console.log(`     • 1 Admin account`);
    console.log(`     • ${products.length} Products`);
    console.log(`     • 2 Stores`);
    console.log(`     • 2 Supermarket accounts`);
    console.log('\n  🔑 Login Credentials:');
    console.log(`     Admin       → admin@tastynam-keens.com  | Admin@TastyNamkeens2024`);
    console.log(`     Supermarket → srilakshmi@example.com   | Supermarket@123`);
    console.log(`     Supermarket → balaji@example.com        | Supermarket@456`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed failed:', error.message);
    if (error.code === 11000) {
      console.error('   Duplicate key detected. Use --fresh to reset: npm run seed -- --fresh');
    }
    process.exit(1);
  }
};

seedDB();
