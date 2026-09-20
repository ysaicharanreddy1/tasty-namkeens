/**
 * seedProd.js – Production Database Seeding Script (50+ Snack Catalog)
 *
 * Designed for cloud deployment (MongoDB Atlas).
 * Populates:
 *   - 1 Master Admin Account
 *   - 52 Signature Indian Snack Varieties across 8 categories
 *   - 2 Initial Retail Supermarkets
 *   - 2 Supermarket Login Accounts
 *   - Store ↔ Product Mappings
 *
 * Usage:
 *   npm run seed:prod
 *   node src/seedProd.js "mongodb+srv://user:pass@cluster.mongodb.net/tasty-namkeens"
 *   npm run seed:prod -- --fresh
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Allow MONGO_URI from CLI argument (e.g. node src/seedProd.js <URI>)
const cliUri = process.argv.find((arg) => arg.startsWith('mongodb://') || arg.startsWith('mongodb+srv://'));
const MONGO_URI = cliUri || process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ Error: No MongoDB URI provided.');
  console.error('   Please set MONGO_URI in .env or pass it as an argument:');
  console.error('   npm run seed:prod -- "mongodb+srv://<user>:<password>@<cluster>.mongodb.net/tasty-namkeens"\n');
  process.exit(1);
}

const User = require('./models/User');
const Product = require('./models/Product');
const Store = require('./models/Store');
const Order = require('./models/Order');

// ── Master Admin Account ───────────────────────────────────────────────────
const adminData = {
  name: 'Tasty Namkeens Admin',
  email: 'admin@tastynam-keens.com',
  password: 'Admin@TastyNamkeens2024',
  role: 'admin',
  phone: '9000000000',
  address: {
    street: 'Tasty Namkeens Corporate Office & Factory, Industrial Estate',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500001',
  },
};

// ── 52 Authentic Snack Varieties ───────────────────────────────────────────
const catalog50Plus = [
  // ── BHUJIA & SEV (1-8) ──
  {
    name: 'Aloo Bhujia',
    category: 'Bhujia',
    netWeight: '200g',
    description: 'Crispy potato noodles infused with mint, cumin, and fiery dried red chillies.',
    ingredients: 'Potato starch, gram flour (besan), vegetable oil, salt, red chilli, mint powder.',
    wholesalePrice: 55,
    minOrderQty: 20,
    imageUrl: '/images/aloo-bhujia.png',
  },
  {
    name: 'Royal Bikaneri Bhujia',
    category: 'Bhujia',
    netWeight: '400g',
    description: 'Traditional Rajasthani moth dal bhujia spiced with crushed black pepper and clove.',
    ingredients: 'Moth dal flour, besan, ground spices, black pepper, iodised salt, edible vegetable oil.',
    wholesalePrice: 95,
    minOrderQty: 15,
    imageUrl: '/images/bikaneri-bhujia.png',
  },
  {
    name: 'Ratlami Sev',
    category: 'Bhujia',
    netWeight: '250g',
    description: 'Thick, bold sev seasoned with intense Malwi cloves, ajwain, and peppercorns.',
    ingredients: 'Bengal gram flour, cloves, carom seeds, black pepper, hing, salt, refined oil.',
    wholesalePrice: 70,
    minOrderQty: 15,
    imageUrl: '/images/ratlami-sev.png',
  },
  {
    name: 'Nylon Sev Extra Thin',
    category: 'Bhujia',
    netWeight: '200g',
    description: 'Super-fine golden sev crafted specifically as a crunchy topping for chaats and poha.',
    ingredients: 'Finest gram flour, turmeric, iodised salt, peanut oil.',
    wholesalePrice: 50,
    minOrderQty: 25,
    imageUrl: '/images/nylon-sev.png',
  },
  {
    name: 'Garlic Lasun Sev',
    category: 'Bhujia',
    netWeight: '200g',
    description: 'Crunchy chickpea sev packed with robust roasted garlic and red chilli masala.',
    ingredients: 'Chickpea flour, fresh garlic paste, Kashmiri chilli, salt, edible oil.',
    wholesalePrice: 55,
    minOrderQty: 20,
    imageUrl: '/images/garlic-sev.png',
  },
  {
    name: 'Palak Pudina Sev',
    category: 'Bhujia',
    netWeight: '200g',
    description: 'Herbaceous spinach and mint flavoured crispy sev with refreshing chaat notes.',
    ingredients: 'Gram flour, fresh spinach puree, mint leaves, cumin, dry mango powder, oil.',
    wholesalePrice: 58,
    minOrderQty: 20,
    imageUrl: '/images/palak-sev.png',
  },
  {
    name: 'Bhavnagari Gathiya',
    category: 'Bhujia',
    netWeight: '250g',
    description: 'Soft, melt-in-the-mouth Gujarati gathiya delicately seasoned with carom seeds and soda.',
    ingredients: 'Besan, ajwain, black pepper, alkaline salt (papad khar), peanut oil.',
    wholesalePrice: 75,
    minOrderQty: 15,
    imageUrl: '/images/bhavnagari-gathiya.png',
  },
  {
    name: 'Tikha Methi Gathiya',
    category: 'Bhujia',
    netWeight: '250g',
    description: 'Spicy crisps flavoured with fragrant sun-dried fenugreek leaves (kasoori methi).',
    ingredients: 'Gram flour, kasoori methi, red chilli, hing, turmeric, salt, oil.',
    wholesalePrice: 75,
    minOrderQty: 15,
    imageUrl: '/images/methi-gathiya.png',
  },

  // ── CHIVDA & POHA SNACKS (9-16) ──
  {
    name: 'Kanda Poha Chivda',
    category: 'Chivda',
    netWeight: '300g',
    description: 'Thin beaten rice flakes tossed with fried onions, roasted peanuts, and curry leaves.',
    ingredients: 'Poha (rice flakes), dried onion, groundnuts, mustard seeds, curry leaves, turmeric, sugar, salt.',
    wholesalePrice: 85,
    minOrderQty: 12,
    imageUrl: '/images/kanda-poha-chivda.png',
  },
  {
    name: 'Cornflakes Sweet & Spicy Chivda',
    category: 'Chivda',
    netWeight: '250g',
    description: 'Golden crunchy cornflakes blended with golden raisins, cashews, and tangy spices.',
    ingredients: 'Cornflakes, peanuts, cashews, raisins, sesame seeds, chilli powder, amchur, oil.',
    wholesalePrice: 80,
    minOrderQty: 15,
    imageUrl: '/images/cornflakes-chivda.png',
  },
  {
    name: 'Kolhapuri Bhadang Chivda',
    category: 'Chivda',
    netWeight: '350g',
    description: 'Puffed rice tossed in spicy Kolhapuri garlic-chilli oil with crunchy roasted gram.',
    ingredients: 'Murmura (puffed rice), garlic, roasted daliya, peanuts, red chilli, mustard, curry leaves.',
    wholesalePrice: 75,
    minOrderQty: 15,
    imageUrl: '/images/kolhapuri-bhadang.png',
  },
  {
    name: 'Diet Roasted Murmura Chivda',
    category: 'Chivda',
    netWeight: '200g',
    description: 'Zero-oil dry roasted puffed rice tempered with turmeric, green chillies, and curry leaves.',
    ingredients: 'Puffed rice, roasted gram, green chillies, rock salt, turmeric, mustard seeds.',
    wholesalePrice: 45,
    minOrderQty: 25,
    imageUrl: '/images/diet-murmura.png',
  },
  {
    name: 'Sabudana Farali Chivda',
    category: 'Chivda',
    netWeight: '200g',
    description: 'Crispy fried tapioca pearls mixed with potato sticks and roasted rock-salted peanuts.',
    ingredients: 'Tapioca sago, dehydrated potato shreds, groundnuts, sendha namak, black pepper.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/sabudana-chivda.png',
  },
  {
    name: 'Makhana Mint Masala Chivda',
    category: 'Chivda',
    netWeight: '100g',
    description: 'Slow-roasted lotus seeds coated with tangy pudina chaat masala. Superfood snacking.',
    ingredients: 'Fox nuts (phool makhana), cold-pressed olive oil, mint powder, black salt, amchur.',
    wholesalePrice: 110,
    minOrderQty: 15,
    imageUrl: '/images/makhana-chivda.png',
  },
  {
    name: 'Roasted Oats & Moong Chivda',
    category: 'Chivda',
    netWeight: '200g',
    description: 'High-fibre roasted rolled oats blended with moong sprouts and sunflower seeds.',
    ingredients: 'Rolled oats, roasted moong, pumpkin seeds, cumin, turmeric, iodised salt.',
    wholesalePrice: 70,
    minOrderQty: 20,
    imageUrl: '/images/oats-chivda.png',
  },
  {
    name: 'Nashik Spiced Chivda',
    category: 'Chivda',
    netWeight: '300g',
    description: 'Traditional thick poha chivda from Maharashtra flavoured with dry coconut slices and fennel.',
    ingredients: 'Thick poha, copra (dry coconut), peanuts, fennel seeds, coriander seeds, spices.',
    wholesalePrice: 85,
    minOrderQty: 15,
    imageUrl: '/images/nashik-chivda.png',
  },

  // ── LENTIL & PULSE SNACKS (17-24) ──
  {
    name: 'Moong Dal Namkeen',
    category: 'Lentil Snacks',
    netWeight: '250g',
    description: 'Whole split moong dal gently fried to golden yellow crunchiness and salted to perfection.',
    ingredients: 'Moong dal, refined vegetable oil, salt, black pepper, lemon powder, asafoetida.',
    wholesalePrice: 70,
    minOrderQty: 15,
    imageUrl: '/images/moong-dal.png',
  },
  {
    name: 'Masala Chana Dal',
    category: 'Lentil Snacks',
    netWeight: '250g',
    description: 'Crunchy split Bengal gram tossed in zesty red chilli, amchur, and dry mint masala.',
    ingredients: 'Chana dal, vegetable oil, red chilli powder, dry mango powder, rock salt, ginger powder.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/masala-chana-dal.png',
  },
  {
    name: 'Crispy Masoor Dal',
    category: 'Lentil Snacks',
    netWeight: '200g',
    description: 'Whole brown lentils deep-fried to an airy crunch and dusted with chaat seasoning.',
    ingredients: 'Masoor dal, edible oil, salt, dried mango powder, black pepper, cumin.',
    wholesalePrice: 60,
    minOrderQty: 20,
    imageUrl: '/images/masoor-dal.png',
  },
  {
    name: 'Salted Kara Boondi',
    category: 'Lentil Snacks',
    netWeight: '250g',
    description: 'Crispy besan pearls seasoned with crushed curry leaves, garlic, and ground sea salt.',
    ingredients: 'Besan, curry leaves, garlic flakes, cashew nuts, salt, vegetable oil.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/kara-boondi.png',
  },
  {
    name: 'Hing Jeera Boondi',
    category: 'Lentil Snacks',
    netWeight: '250g',
    description: 'Crunchy spherical savouries seasoned with aromatic asafoetida and dry roasted cumin.',
    ingredients: 'Chickpea flour, asafoetida (hing), roasted jeera, salt, oil.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/hing-jeera-boondi.png',
  },
  {
    name: 'Spicy Fried Kabuli Chana',
    category: 'Lentil Snacks',
    netWeight: '200g',
    description: 'Jumbo chickpeas roasted to a bold crunch and tossed in fiery gunpowder masala.',
    ingredients: 'Kabuli chana, chilli powder, amchur, black salt, garam masala, oil.',
    wholesalePrice: 60,
    minOrderQty: 20,
    imageUrl: '/images/spicy-chana.png',
  },
  {
    name: 'Roasted Soya Katori',
    category: 'Lentil Snacks',
    netWeight: '150g',
    description: 'Cup-shaped crispy soya snack packed with 15g plant protein per serving.',
    ingredients: 'Defatted soya flour, wheat starch, seasoning blend, onion powder, salt, oil.',
    wholesalePrice: 50,
    minOrderQty: 25,
    imageUrl: '/images/soya-katori.png',
  },
  {
    name: 'Salted Green Peas Crisps',
    category: 'Lentil Snacks',
    netWeight: '200g',
    description: 'Whole dried green peas fried and seasoned with sea salt and dry coriander powder.',
    ingredients: 'Green peas, vegetable oil, salt, dry mango powder, cumin.',
    wholesalePrice: 55,
    minOrderQty: 20,
    imageUrl: '/images/green-peas.png',
  },

  // ── MATHRI & PAPDI CRACKERS (25-32) ──
  {
    name: 'Peri Peri Mathri',
    category: 'Mathri',
    netWeight: '150g',
    description: 'Flaky, circular wheat crackers coated with fiery African bird-eye peri peri seasoning.',
    ingredients: 'Refined wheat flour, ajwain, peri peri spice blend, salt, vegetable shortening.',
    wholesalePrice: 48,
    minOrderQty: 25,
    imageUrl: '/images/peri-peri-mathri.png',
  },
  {
    name: 'Kasuri Methi Mathri',
    category: 'Mathri',
    netWeight: '250g',
    description: 'Classic Rajasthani tea-time mathri loaded with fresh dried fenugreek leaves and pepper.',
    ingredients: 'Maida, kasoori methi, peppercorns, cumin, salt, refined fat.',
    wholesalePrice: 70,
    minOrderQty: 20,
    imageUrl: '/images/methi-mathri.png',
  },
  {
    name: 'Achari Triangle Mathri',
    category: 'Mathri',
    netWeight: '200g',
    description: 'Crisp layered triangle crackers infused with tangy mango pickle masala oil.',
    ingredients: 'Wheat flour, pickle masala (mustard, fennel, kalonji), salt, oil.',
    wholesalePrice: 60,
    minOrderQty: 20,
    imageUrl: '/images/achari-mathri.png',
  },
  {
    name: 'Crunchy Masala Papdi',
    category: 'Mathri',
    netWeight: '250g',
    description: 'Thin, crispy diamond wafers seasoned with ajwain. Perfect companion for evening chai.',
    ingredients: 'Gram flour, wheat flour, ajwain, red chilli, hing, salt, oil.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/masala-papdi.png',
  },
  {
    name: 'Ajwain Farsi Puri',
    category: 'Mathri',
    netWeight: '200g',
    description: 'Crispy flaky puri from Gujarat with layers of ghee, cumin, and cracked black pepper.',
    ingredients: 'Maida, pure ghee, carom seeds, black pepper, salt.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/farsi-puri.png',
  },
  {
    name: 'Spicy Namak Para',
    category: 'Mathri',
    netWeight: '250g',
    description: 'Diamond-cut salted flour ribbons fried golden and crisp. An Indian festival staple.',
    ingredients: 'Refined flour, semolina (sooji), ajwain, cumin, salt, edible fat.',
    wholesalePrice: 60,
    minOrderQty: 20,
    imageUrl: '/images/namak-para.png',
  },
  {
    name: 'Sweet & Salty Shakkarpara',
    category: 'Mathri',
    netWeight: '250g',
    description: 'Bite-sized crispy squares delicately sweetened with cardamom and cane sugar syrup.',
    ingredients: 'Wheat flour, sugar, cardamom powder, milk solids, pure ghee, vegetable oil.',
    wholesalePrice: 70,
    minOrderQty: 15,
    imageUrl: '/images/shakkarpara.png',
  },
  {
    name: 'Baked Whole Wheat Mathri',
    category: 'Mathri',
    netWeight: '180g',
    description: 'Guilt-free 100% whole-wheat mathri baked to crispy perfection without deep frying.',
    ingredients: 'Whole wheat flour (atta), cold-pressed oil, ajwain, rock salt, cumin.',
    wholesalePrice: 75,
    minOrderQty: 20,
    imageUrl: '/images/baked-mathri.png',
  },

  // ── PEANUTS & NUT SNACKS (33-40) ──
  {
    name: 'Roasted Masala Peanuts',
    category: 'Peanuts',
    netWeight: '500g',
    description: 'Jumbo Bharuch groundnuts dry-roasted in sea salt and dusted with tangy chaat blend.',
    ingredients: 'Groundnuts, black salt, amchur, cumin, chilli powder, edible oil.',
    wholesalePrice: 120,
    minOrderQty: 10,
    imageUrl: '/images/masala-peanuts.png',
  },
  {
    name: 'Hing Jeera Salted Peanuts',
    category: 'Peanuts',
    netWeight: '250g',
    description: 'Crunchy blanched peanuts tossed in roasted cumin powder and aromatic compounded hing.',
    ingredients: 'Peanuts, asafoetida, cumin, rock salt, vegetable oil.',
    wholesalePrice: 75,
    minOrderQty: 15,
    imageUrl: '/images/hing-peanuts.png',
  },
  {
    name: 'Besan Coated Masala Shing',
    category: 'Peanuts',
    netWeight: '200g',
    description: 'Crispy batter-fried groundnuts coated in a thick, spiced chickpea crust.',
    ingredients: 'Peanuts, besan, rice flour, red chilli, ginger paste, chaat masala, oil.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/coated-peanuts.png',
  },
  {
    name: 'Black Pepper Roasted Kaju',
    category: 'Peanuts',
    netWeight: '150g',
    description: 'W320 grade cashew nuts roasted in pure ghee and dusted with Malabar black pepper.',
    ingredients: 'Cashew nuts, pure cow ghee, Tellicherry black pepper, rock salt.',
    wholesalePrice: 195,
    minOrderQty: 10,
    imageUrl: '/images/pepper-kaju.png',
  },
  {
    name: 'Chilli Garlic Almonds',
    category: 'Peanuts',
    netWeight: '150g',
    description: 'California almonds dry-roasted with pungent Kashmiri garlic and spicy paprika.',
    ingredients: 'Almonds, garlic oil, Kashmiri chilli, paprika, Himalayan pink salt.',
    wholesalePrice: 180,
    minOrderQty: 10,
    imageUrl: '/images/chilli-almonds.png',
  },
  {
    name: 'Classic Salted Peanuts (Singdana)',
    category: 'Peanuts',
    netWeight: '400g',
    description: 'Traditional Gujarati singdana roasted in hot sand and vacuum-sealed for crunch.',
    ingredients: 'Peanuts, refined iodised salt.',
    wholesalePrice: 90,
    minOrderQty: 15,
    imageUrl: '/images/salted-peanuts.png',
  },
  {
    name: 'Spicy Crunchy Soya Peanuts',
    category: 'Peanuts',
    netWeight: '200g',
    description: 'Dual-crunch fusion of roasted groundnuts and high-protein spiced soya nuggets.',
    ingredients: 'Peanuts, defatted soya chips, turmeric, garam masala, salt, oil.',
    wholesalePrice: 60,
    minOrderQty: 20,
    imageUrl: '/images/soya-peanuts.png',
  },
  {
    name: 'Sweet Jaggery Roasted Chana',
    category: 'Peanuts',
    netWeight: '250g',
    description: 'High-iron roasted Bengal gram coated with organic jaggery and crushed sesame.',
    ingredients: 'Roasted chana, organic gur (jaggery), white sesame seeds, cardamom, ghee.',
    wholesalePrice: 85,
    minOrderQty: 15,
    imageUrl: '/images/gur-chana.png',
  },

  // ── SIGNATURE MIXTURES (41-46) ──
  {
    name: 'Navratan Royal Mixture',
    category: 'Mixture',
    netWeight: '400g',
    description: 'Rich royal blend of 9 savory ingredients: cashews, raisins, sev, lentils, and flakes.',
    ingredients: 'Besan, cashews, raisins, moong dal, chana dal, peanuts, cornflakes, spices, oil.',
    wholesalePrice: 115,
    minOrderQty: 10,
    imageUrl: '/images/navratan-mixture.png',
  },
  {
    name: 'Khatta Meetha Sweet & Sour Mixture',
    category: 'Mixture',
    netWeight: '400g',
    description: 'Tangy sweet-sour harmony of sago pearls, green peas, crispy sev, and rice flakes.',
    ingredients: 'Gram flour noodles, rice flakes, sago, green peas, sugar, citric acid, turmeric, salt.',
    wholesalePrice: 95,
    minOrderQty: 12,
    imageUrl: '/images/khatta-meetha.png',
  },
  {
    name: 'South Indian Madras Mixture',
    category: 'Mixture',
    netWeight: '300g',
    description: 'Authentic Tamil Nadu tea-stall mixture with ribbon pakoda, kara boondi, and curry leaves.',
    ingredients: 'Besan, rice flour, roasted groundnuts, roasted daliya, curry leaves, hing, red chilli, oil.',
    wholesalePrice: 80,
    minOrderQty: 15,
    imageUrl: '/images/madras-mixture.png',
  },
  {
    name: 'Kashmiri Mewa Mixture',
    category: 'Mixture',
    netWeight: '250g',
    description: 'Exotic blend of dry fruits, potato salli, and melon seeds flavored with saffron aroma.',
    ingredients: 'Potato shreds, almonds, cashews, raisins, melon seeds, fennel, amchur, oil.',
    wholesalePrice: 140,
    minOrderQty: 10,
    imageUrl: '/images/kashmiri-mixture.png',
  },
  {
    name: 'Cornflakes Special Mixture',
    category: 'Mixture',
    netWeight: '300g',
    description: 'Extra crispy golden cornflakes tossed with roasted gram and spiced potato sticks.',
    ingredients: 'Cornflakes, potato salli, peanuts, salt, dry mango, red chilli, vegetable oil.',
    wholesalePrice: 75,
    minOrderQty: 15,
    imageUrl: '/images/corn-mixture.png',
  },
  {
    name: 'Panchratan Dry Fruit Mixture',
    category: 'Mixture',
    netWeight: '200g',
    description: 'Fasting-friendly blend of potato salli, cashews, raisins, peanuts, and rock salt.',
    ingredients: 'Potato sticks, cashews, peanuts, raisins, sendha namak, black pepper, edible oil.',
    wholesalePrice: 110,
    minOrderQty: 12,
    imageUrl: '/images/panchratan-mixture.png',
  },

  // ── TRADITIONAL REGIONAL SAVOURIES (47-52) ──
  {
    name: 'South Indian Butter Murukku',
    category: 'Namkeens',
    netWeight: '200g',
    description: 'Melt-in-mouth spiral crisps crafted with roasted rice flour and fresh creamery butter.',
    ingredients: 'Rice flour, urad dal flour, white butter, sesame seeds, cumin, salt, oil.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/butter-murukku.png',
  },
  {
    name: 'Spicy Ribbon Pakoda',
    category: 'Namkeens',
    netWeight: '200g',
    description: 'Flat, crunchy ribbon strips prepared with rice-besan dough and fiery chilli garlic.',
    ingredients: 'Rice flour, gram flour, garlic, red chilli powder, hing, butter, salt, oil.',
    wholesalePrice: 60,
    minOrderQty: 20,
    imageUrl: '/images/ribbon-pakoda.png',
  },
  {
    name: 'Kerala Nendran Banana Chips',
    category: 'Chips',
    netWeight: '250g',
    description: 'Wafer-thin raw Nendran bananas fried in cold-pressed pure coconut oil and sea salted.',
    ingredients: 'Raw Nendran bananas, 100% pure coconut oil, turmeric, sea salt.',
    wholesalePrice: 95,
    minOrderQty: 15,
    imageUrl: '/images/banana-chips.png',
  },
  {
    name: 'Pepper Tapioca Chips',
    category: 'Chips',
    netWeight: '200g',
    description: 'Crunchy cassava wafers sliced paper-thin and dusted with Tellicherry black pepper.',
    ingredients: 'Tapioca root, vegetable oil, black pepper powder, rock salt.',
    wholesalePrice: 70,
    minOrderQty: 15,
    imageUrl: '/images/tapioca-chips.png',
  },
  {
    name: 'Spicy Potato Salli (Aloo Lachha)',
    category: 'Chips',
    netWeight: '200g',
    description: 'Crispy shredded potato sticks seasoned with tangy red chilli and rock salt.',
    ingredients: 'Potatoes, edible vegetable oil, red chilli, rock salt, amchur, cumin.',
    wholesalePrice: 65,
    minOrderQty: 20,
    imageUrl: '/images/aloo-lachha.png',
  },
  {
    name: 'Crispy Wheat Chakli',
    category: 'Namkeens',
    netWeight: '200g',
    description: 'Traditional Maharashtrian Bhajaniche chakli made from roasted multi-grain flour.',
    ingredients: 'Rice, chana dal, urad dal, coriander seeds, cumin, sesame, red chilli, oil.',
    wholesalePrice: 70,
    minOrderQty: 15,
    imageUrl: '/images/wheat-chakli.png',
  },
];

// ── Physical Supermarkets ──────────────────────────────────────────────────
const storesData = [
  {
    storeName: 'Sri Lakshmi Supermarket',
    ownerName: 'Ravi Kumar',
    address: {
      street: '14, Main Road, Ameerpet',
      landmark: 'Near Metro Station Pillar 1042',
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
      landmark: 'Opposite Main Bus Depo',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500060',
    },
    phone: '9123456789',
    whatsappNumber: '919123456789',
    openingHours: 'Mon–Sat: 9:00 AM – 9:00 PM',
  },
];

// ── Supermarket Accounts ───────────────────────────────────────────────────
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

async function seedProduction() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🥜 TASTY NAMKEENS — PRODUCTION CLOUD SEEDER (50+ VARIETIES)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`Connecting to MongoDB at: ${MONGO_URI.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Cloud Database.\n');

    const isFresh = process.argv.includes('--fresh');

    if (isFresh) {
      console.log('🗑️  --fresh flag detected. Resetting existing collections...');
      await Promise.all([
        User.deleteMany({}),
        Product.deleteMany({}),
        Store.deleteMany({}),
        Order.deleteMany({}),
      ]);
      console.log('   ✅ Collections reset successfully.\n');
    } else {
      const existingAdmin = await User.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log('⚠️  Database is already initialized (Admin account exists).');
        console.log('   To re-seed fresh, run: npm run seed:prod -- --fresh\n');
        process.exit(0);
      }
    }

    // 1. Admin
    console.log('👤 [1/5] Creating Master Admin Account...');
    const admin = await User.create(adminData);
    console.log(`   ✅ Admin created: ${admin.email}\n`);

    // 2. 52 Products
    console.log(`🥜 [2/5] Creating ${catalog50Plus.length} Snack Varieties...`);
    const createdProducts = await Product.create(catalog50Plus);
    console.log(`   ✅ Created ${createdProducts.length} snack varieties across 8 categories.\n`);

    // 3. Stores
    console.log('🏪 [3/5] Creating Retail Supermarkets in Store Finder...');
    // Store 1 carries all 52 products
    const store1 = await Store.create({
      ...storesData[0],
      activeSnacks: createdProducts.map((p) => p._id),
    });

    // Store 2 carries first 30 products
    const store2 = await Store.create({
      ...storesData[1],
      activeSnacks: createdProducts.slice(0, 30).map((p) => p._id),
    });
    console.log(`   ✅ ${store1.storeName} (${store1.activeSnacks.length} snacks stocked)`);
    console.log(`   ✅ ${store2.storeName} (${store2.activeSnacks.length} snacks stocked)\n`);

    // 4. Map Product Available Stores
    console.log('🔗 [4/5] Mapping Store References to Catalog...');
    await Product.updateMany(
      { _id: { $in: createdProducts.map((p) => p._id) } },
      { $addToSet: { availableStores: store1._id } }
    );
    await Product.updateMany(
      { _id: { $in: createdProducts.slice(0, 30).map((p) => p._id) } },
      { $addToSet: { availableStores: store2._id } }
    );
    console.log('   ✅ Bidirectional Store ↔ Product references mapped.\n');

    // 5. Supermarket User Accounts
    console.log('👥 [5/5] Provisioning Supermarket Login Accounts...');
    const sm1 = await User.create({ ...supermarketsData[0], storeRef: store1._id });
    const sm2 = await User.create({ ...supermarketsData[1], storeRef: store2._id });

    store1.userRef = sm1._id;
    store2.userRef = sm2._id;
    await store1.save();
    await store2.save();
    console.log(`   ✅ ${sm1.name} (login: ${sm1.email})`);
    console.log(`   ✅ ${sm2.name} (login: ${sm2.email})\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉 CLOUD DATABASE INITIALIZED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  📦 Total Snacks Seeded   : ${createdProducts.length} varieties`);
    console.log(`  🏪 Retail Stores Created : 2 physical supermarkets`);
    console.log(`  👤 Admin Email           : ${adminData.email}`);
    console.log(`  🔐 Admin Password        : ${adminData.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Cloud Seed Failed:', error);
    process.exit(1);
  }
}

seedProduction();
