import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import StoreFinderModal from '../components/StoreFinderModal';
import api from '../api/axios';
import { 
  Package, 
  Store, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Users, 
  Loader2,
  RefreshCw
} from 'lucide-react';

// Realistic sample snack varieties for fallback demonstration
const FALLBACK_PRODUCTS = [
  {
    _id: 'seed-1',
    name: 'Aloo Bhujia',
    category: 'Bhujia',
    netWeight: '200g',
    description: 'Classic crispy potato bhujia seasoned with a perfect blend of spices. A timeless Indian snack loved by all ages.',
    ingredients: 'Potato starch, besan (chickpea flour), salt, turmeric, red chilli powder, cumin, vegetable oil.',
    availableStores: [
      {
        _id: 'store-1',
        storeName: 'Sri Lakshmi Supermarket',
        ownerName: 'Ravi Kumar',
        address: { street: '14, Main Road, Ameerpet', city: 'Hyderabad', state: 'Telangana', pincode: '500016' },
        phone: '9876543210',
        whatsappNumber: '919876543210',
        openingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
      },
      {
        _id: 'store-2',
        storeName: 'Balaji General Store',
        ownerName: 'Suresh Reddy',
        address: { street: '7, Gandhi Nagar, Dilsukhnagar', city: 'Hyderabad', state: 'Telangana', pincode: '500060' },
        phone: '9123456789',
        whatsappNumber: '919123456789',
        openingHours: 'Mon–Sat: 9:00 AM – 9:00 PM',
      },
    ],
  },
  {
    _id: 'seed-2',
    name: 'Moong Dal Namkeen',
    category: 'Lentil Snacks',
    netWeight: '250g',
    description: 'Premium whole moong dal fried to golden perfection. Light, crunchy, and mildly spiced for a guilt-free snacking experience.',
    ingredients: 'Moong dal, vegetable oil, salt, black pepper, asafoetida (hing), lemon powder.',
    availableStores: [
      {
        _id: 'store-1',
        storeName: 'Sri Lakshmi Supermarket',
        ownerName: 'Ravi Kumar',
        address: { street: '14, Main Road, Ameerpet', city: 'Hyderabad', state: 'Telangana', pincode: '500016' },
        phone: '9876543210',
        whatsappNumber: '919876543210',
        openingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
      },
    ],
  },
  {
    _id: 'seed-3',
    name: 'Kanda Poha Chivda',
    category: 'Chivda',
    netWeight: '300g',
    description: 'A Maharashtrian specialty! Thin flattened rice mixed with crunchy onion, peanuts, and a blend of sweet & spicy masalas.',
    ingredients: 'Thin poha, fried onion, groundnuts, curry leaves, green chilli, sugar, salt, oil.',
    availableStores: [
      {
        _id: 'store-1',
        storeName: 'Sri Lakshmi Supermarket',
        ownerName: 'Ravi Kumar',
        address: { street: '14, Main Road, Ameerpet', city: 'Hyderabad', state: 'Telangana', pincode: '500016' },
        phone: '9876543210',
        whatsappNumber: '919876543210',
        openingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
      },
      {
        _id: 'store-2',
        storeName: 'Balaji General Store',
        ownerName: 'Suresh Reddy',
        address: { street: '7, Gandhi Nagar, Dilsukhnagar', city: 'Hyderabad', state: 'Telangana', pincode: '500060' },
        phone: '9123456789',
        whatsappNumber: '919123456789',
        openingHours: 'Mon–Sat: 9:00 AM – 9:00 PM',
      },
    ],
  },
  {
    _id: 'seed-4',
    name: 'Peri Peri Mathri',
    category: 'Mathri',
    netWeight: '150g',
    description: 'Flaky, crispy wheat-flour crackers dusted with fiery peri peri seasoning. A bold twist on the traditional mathri.',
    ingredients: 'Wheat flour, vanaspati, peri peri seasoning, salt, carom seeds, baking soda.',
    availableStores: [
      {
        _id: 'store-1',
        storeName: 'Sri Lakshmi Supermarket',
        ownerName: 'Ravi Kumar',
        address: { street: '14, Main Road, Ameerpet', city: 'Hyderabad', state: 'Telangana', pincode: '500016' },
        phone: '9876543210',
        whatsappNumber: '919876543210',
        openingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
      },
    ],
  },
  {
    _id: 'seed-5',
    name: 'Roasted Masala Peanuts',
    category: 'Peanuts',
    netWeight: '500g',
    description: 'Jumbo-sized groundnuts dry-roasted and coated in a tangy chaat masala blend. High protein, zero guilt.',
    ingredients: 'Groundnuts, salt, chaat masala, amchur, red chilli powder, cumin powder.',
    availableStores: [
      {
        _id: 'store-1',
        storeName: 'Sri Lakshmi Supermarket',
        ownerName: 'Ravi Kumar',
        address: { street: '14, Main Road, Ameerpet', city: 'Hyderabad', state: 'Telangana', pincode: '500016' },
        phone: '9876543210',
        whatsappNumber: '919876543210',
        openingHours: 'Mon–Sun: 8:00 AM – 10:00 PM',
      },
      {
        _id: 'store-2',
        storeName: 'Balaji General Store',
        ownerName: 'Suresh Reddy',
        address: { street: '7, Gandhi Nagar, Dilsukhnagar', city: 'Hyderabad', state: 'Telangana', pincode: '500060' },
        phone: '9123456789',
        whatsappNumber: '919123456789',
        openingHours: 'Mon–Sat: 9:00 AM – 9:00 PM',
      },
    ],
  },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products');
      if (res.data?.success && res.data.data?.length > 0) {
        setProducts(res.data.data);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.warn('Backend not responding, using offline demonstration products:', err.message);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and selected category
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. Public Catalog Section */}
        <section id="catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-crimson" />
              <span>Public Product Showcase</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
              Explore Our Signature <span className="text-brand-crimson">50+ Varieties</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Each batch is crafted with freshly ground traditional spices and top-grade pulses. Click{' '}
              <strong className="text-brand-crimson">"Find Nearby Store"</strong> on any snack to see retail supermarkets carrying it.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="mb-10">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Loader2 className="w-10 h-10 text-brand-crimson animate-spin" />
              <p className="font-semibold text-sm">Loading snack varieties from catalog...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center max-w-md mx-auto space-y-4">
              <div className="text-4xl">🔍</div>
              <h3 className="font-bold text-gray-800 text-base">No snack varieties matched</h3>
              <p className="text-xs text-gray-500">
                Try searching for "Bhujia", "Chivda", or select "All" categories to view the full product range.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-crimson hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onFindStore={(p) => setActiveModalProduct(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. B2B Wholesale Info & How It Works */}
        <section id="b2b-info" className="py-20 bg-gradient-to-b from-amber-50/70 to-white border-y border-amber-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-crimson bg-red-100 px-3 py-1 rounded-full">
                For Supermarkets & Retailers
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight">
                How Wholesale Distribution Works
              </h2>
              <p className="text-sm text-gray-600">
                A streamlined, zero-friction supply chain engineered specifically for independent supermarkets, regional grocery chains, and bulk distributors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-amber-200 shadow-sm relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-brand-crimson font-black text-xl flex items-center justify-center">
                  1
                </div>
                <h3 className="font-extrabold text-lg text-brand-charcoal">
                  WhatsApp Admin Verification
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We maintain strict quality by working only with authorized supermarkets. Contact the admin via WhatsApp to share your store GST/FSSAI details.
                </p>
                <div className="pt-2 text-xs font-semibold text-brand-crimson">
                  No public signup forms • Direct Admin Approval
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-amber-200 shadow-sm relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 font-black text-xl flex items-center justify-center">
                  2
                </div>
                <h3 className="font-extrabold text-lg text-brand-charcoal">
                  Access Bulk Wholesale Rates
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Once approved, login with your assigned credentials to view wholesale packet pricing, minimum batch order quantities, and live inventory.
                </p>
                <div className="pt-2 text-xs font-semibold text-amber-800">
                  Protected B2B Pricing • Minimum 10-25 Packets/Line
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-amber-200 shadow-sm relative space-y-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xl flex items-center justify-center">
                  3
                </div>
                <h3 className="font-extrabold text-lg text-brand-charcoal">
                  Direct Store Dispatch & Listing
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your store is mapped to the snacks you stock, automatically appearing on our public "Find Nearby Store" locator to drive foot traffic.
                </p>
                <div className="pt-2 text-xs font-semibold text-emerald-700">
                  Free Foot-Traffic Marketing to Nearby Buyers
                </div>
              </div>
            </div>

            {/* Banner CTA */}
            <div className="mt-16 bg-gradient-to-r from-brand-crimson to-red-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center lg:text-left">
                <h3 className="text-2xl sm:text-3xl font-black">
                  Ready to Stock Tasty Namkeens in Your Supermarket?
                </h3>
                <p className="text-sm text-red-100 max-w-xl">
                  Message our Admin team on WhatsApp right now to request your wholesale partner account.
                </p>
              </div>

              <a
                href="https://wa.me/919999999999?text=Hello%20Admin,%20I%20want%20to%20register%20my%20supermarket%20on%20Tasty%20Namkeens"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm px-6 py-4 rounded-xl shadow-lg transition-all hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Request Account via WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* 4. About Us Section */}
        <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 bg-red-100 text-brand-crimson font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Our Heritage & Promise</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-brand-charcoal tracking-tight leading-tight">
                Crafting Authentic Indian Savouries with Uncompromising Hygiene
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                At Tasty Namkeens, our culinary recipes trace back decades of regional confectionery mastery. From crispy Sev and golden Bhujia to spicy roasted nuts and flaked chivda, every batch is prepared in state-of-the-art hygienic processing lines adhering to international food safety benchmarks.
              </p>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-crimson shrink-0" />
                  <span>100% Pure groundnut and refined vegetable oils — Zero trans fats</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-crimson shrink-0" />
                  <span>Nitrogen-flushed multilayer packaging ensuring 6-month shelf freshness</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-crimson shrink-0" />
                  <span>Dedicated B2B account support and hassle-free returns on defective cartons</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-amber-100 to-red-50 p-8 sm:p-12 rounded-3xl border-2 border-amber-200 text-center space-y-6">
              <div className="text-5xl">🏭</div>
              <h3 className="text-2xl font-black text-brand-charcoal">
                Manufacturer-Direct Distribution
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                By eliminating multi-layered middlemen, Tasty Namkeens provides supermarkets with higher retail margins and guarantees freshly produced stock dispatched straight from our factory floors.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                  <div className="text-2xl font-black text-brand-crimson">50+</div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">Snack Varieties</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-100">
                  <div className="text-2xl font-black text-brand-crimson">100%</div>
                  <div className="text-[11px] font-bold text-gray-500 uppercase">FSSAI Compliant</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* B2C Feature: Find Nearby Store Modal */}
      <StoreFinderModal
        product={activeModalProduct}
        isOpen={!!activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}
