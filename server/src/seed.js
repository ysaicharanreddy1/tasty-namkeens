/**
 * seed.js – Database Seed Script (REAL PRODUCTS)
 *
 * Populates the database with:
 *   ✅ 1 Master Admin account
 *   ✅ 15 REAL Tasty Namkeens products (from actual packaging)
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
  username: '9908478783',
  email: 'admin@tastynam-keens.com',
  password: 'tastynamkeens@123', // Will be hashed by pre-save hook
  role: 'admin',
  phone: '9908478783',
  address: {
    street: 'Plot No. 143, Vivekanda Nagar Colony, Borabanda',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500018',
  },
};

const productsData = [
  // ── Batch 1 ────────────────────────────────────────────────────────
  {
    name: 'Palli Chikki (200g)',
    category: 'Chikki',
    netWeight: '200g',
    mrp: 70,
    description:
      'Traditional peanut chikki made with premium palli and jaggery. A crunchy, sweet snack perfect with tea or as an energy bar.',
    ingredients: 'Palli, jaggery, liquid glucose.',
    wholesalePrice: 50,
    minOrderQty: 20,
    imageUrl: '/images/products/palli-chikki-200g.jpg',
  },
  {
    name: 'Palli Laddu',
    category: 'Laddu',
    netWeight: '200g',
    mrp: 70,
    description:
      'Hand-rolled peanut laddus made with roasted palli and jaggery. A wholesome traditional sweet snack packed with protein.',
    ingredients: 'Palli, jaggery, liquid glucose.',
    wholesalePrice: 50,
    minOrderQty: 20,
    imageUrl: '/images/products/palli-laddu-200g.jpg',
  },
  {
    name: 'Butter Chakli',
    category: 'Chakli',
    netWeight: '100g',
    mrp: 40,
    description:
      'Crispy spiral-shaped rice flour chakli with a delicate butter flavor. A popular South Indian tea-time snack.',
    ingredients: 'Rice flour, salt, spices, veg oil, citric acid.',
    wholesalePrice: 28,
    minOrderQty: 30,
    imageUrl: '/images/products/butter-chakli.jpg',
  },
  {
    name: 'Batana',
    category: 'Roasted Snacks',
    netWeight: '100g',
    mrp: 35,
    description:
      'Crunchy roasted batana (chickpeas) seasoned with turmeric and salt. A simple, protein-rich healthy snack.',
    ingredients: 'Batana, turmeric powder, salt.',
    wholesalePrice: 24,
    minOrderQty: 30,
    imageUrl: '/images/products/batana.jpg',
  },
  {
    name: 'Mix Nuts',
    category: 'Mixed Snacks',
    netWeight: '150g',
    mrp: 60,
    description:
      'A crunchy assortment of roasted peanuts, cow peas, green peas, and kabuli chana. The ultimate party mix.',
    ingredients: 'Peanut, cow peas, green peas, kabuli chana.',
    wholesalePrice: 42,
    minOrderQty: 20,
    imageUrl: '/images/products/mix-nuts.jpg',
  },

  // ── Batch 2 ────────────────────────────────────────────────────────
  {
    name: 'Bingo',
    category: 'Chips',
    netWeight: '150g',
    mrp: 70,
    description:
      'Crispy potato-based finger chips seasoned with chilli powder. A spicy, crunchy snack everyone loves.',
    ingredients: 'Potato, iodised salt, chilli powder.',
    wholesalePrice: 50,
    minOrderQty: 20,
    imageUrl: '/images/products/bingo.jpg',
  },
  {
    name: 'Till Laddu (200g)',
    category: 'Laddu',
    netWeight: '200g',
    mrp: 90,
    description:
      'Nutritious sesame seed laddus bound with jaggery. Rich in calcium and iron — a traditional winter delicacy.',
    ingredients: 'Till (sesame seeds), jaggery, liquid glucose.',
    wholesalePrice: 65,
    minOrderQty: 15,
    imageUrl: '/images/products/till-laddu.jpg',
  },
  {
    name: 'Murmura Laddu',
    category: 'Laddu',
    netWeight: '100g',
    mrp: 30,
    description:
      'Light and airy puffed rice laddus with jaggery and roasted grams. A classic sweet snack loved by kids.',
    ingredients: 'Murmura (puffed rice), jaggery, veg oil, roasted grams.',
    wholesalePrice: 20,
    minOrderQty: 30,
    imageUrl: '/images/products/murmura-laddu.jpg',
  },
  {
    name: 'Palli Chikki (100g)',
    category: 'Chikki',
    netWeight: '100g',
    mrp: 35,
    description:
      'Compact peanut chikki bar — same authentic taste in a smaller pack. Great for on-the-go snacking.',
    ingredients: 'Palli, jaggery, liquid glucose.',
    wholesalePrice: 24,
    minOrderQty: 30,
    imageUrl: '/images/products/palli-chikki-100g.jpg',
  },
  {
    name: 'Pasta',
    category: 'Chips',
    netWeight: '150g',
    mrp: 70,
    description:
      'Crunchy pasta-shaped potato snack seasoned with salt and chilli. A fun, spicy munch for all occasions.',
    ingredients: 'Potato, iodised salt, chilli powder.',
    wholesalePrice: 50,
    minOrderQty: 20,
    imageUrl: '/images/products/pasta.jpg',
  },

  // ── Batch 3 ────────────────────────────────────────────────────────
  {
    name: 'Andhra Murkul',
    category: 'Murukku',
    netWeight: '200g',
    mrp: 60,
    description:
      'Authentic Andhra-style murukku made with black gram and rice. Crispy, spicy, and deeply satisfying.',
    ingredients: 'Black gram, rice, chilli, spices, edible oil.',
    wholesalePrice: 42,
    minOrderQty: 20,
    imageUrl: '/images/products/andhra-murkul.jpg',
  },
  {
    name: 'Till Laddu (100g)',
    category: 'Laddu',
    netWeight: '100g',
    mrp: 45,
    description:
      'Bite-sized sesame seed laddus in a convenient smaller pack. Perfect for gifting and daily snacking.',
    ingredients: 'Till (sesame seeds), jaggery, liquid glucose.',
    wholesalePrice: 32,
    minOrderQty: 25,
    imageUrl: '/images/products/till-laddu-100g.jpg',
  },
  {
    name: 'Chana Roasted',
    category: 'Roasted Snacks',
    netWeight: '200g',
    mrp: 60,
    description:
      'Roasted black chana with a light turmeric coating. A high-protein, high-fiber healthy snack option.',
    ingredients: 'Black chana, turmeric powder, salt.',
    wholesalePrice: 42,
    minOrderQty: 20,
    imageUrl: '/images/products/chana-roasted.jpg',
  },
  {
    name: 'Green Pease',
    category: 'Roasted Snacks',
    netWeight: '175g',
    mrp: 70,
    description:
      'Crispy fried green peas with a spicy masala coating. Crunchy, tangy, and utterly addictive.',
    ingredients: 'Green peas, spices, citric acid, edible oil.',
    wholesalePrice: 50,
    minOrderQty: 20,
    imageUrl: '/images/products/green-pease.jpg',
  },
  {
    name: 'Besan Palli',
    category: 'Peanut Snacks',
    netWeight: '200g',
    mrp: 80,
    description:
      'Peanuts coated in a crispy, spicy besan (gram flour) shell. The perfect crunchy namkeen for any gathering.',
    ingredients: 'Besan (gram flour), peanut, chilli, salt, veg oil.',
    wholesalePrice: 56,
    minOrderQty: 15,
    imageUrl: '/images/products/besan-palli.jpg',
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

    // ── Summary ────────────────────────────────────────────────────────────
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉 DATABASE SEEDED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n  📊 Created:`);
    console.log(`     • 1 Admin account (Username: 9908478783)`);
    console.log(`     • ${products.length} Real Products`);
    console.log(`     • 0 Stores (ready to add via Admin Dashboard)`);
    console.log('\n  🔑 Login Credentials:');
    console.log(`     Admin       → Username: 9908478783  | Password: tastynamkeens@123`);
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
