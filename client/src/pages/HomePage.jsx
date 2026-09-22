import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import StoreFinderModal from '../components/StoreFinderModal';
import WhatsAppChat from '../components/WhatsAppChat';
import api from '../api/axios';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data?.success && res.data.data?.length > 0) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.warn('Could not fetch products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((item) => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with the animated slide-down photo banner */}
        <Hero />

        {/* Products Section (Strictly 4 per row) */}
        <section id="products" className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Products</h2>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="mt-8">
            {loading ? (
              <div className="py-16 flex justify-center">
                <Loader2 className="w-8 h-8 text-red-700 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                No products found.{' '}
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="text-red-700 font-medium hover:underline"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              /* Exactly 4 products in a single row, next 4 in next row */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onFindStore={(p) => setActiveModalProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-12 sm:py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Tasty Namkeens</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Repacked by S.V. Enterprises from Plot No. 143, Vivekanda Nagar Colony, Borabanda, Hyderabad.
              We deliver authentic Indian snacks — from traditional palli chikki and till laddu to crispy chakli
              and spicy bingo chips. All products are FSSAI certified (Lic: 23624030002668) and made with
              quality ingredients.
            </p>
            <div className="mt-6 flex items-center justify-center gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-red-700">15+</div>
                <div className="text-xs text-gray-500">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">FSSAI</div>
                <div className="text-xs text-gray-500">Certified</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">100%</div>
                <div className="text-xs text-gray-500">Vegetarian</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* WhatsApp Chat Widget */}
      <WhatsAppChat />

      {/* Store Finder Modal */}
      <StoreFinderModal
        product={activeModalProduct}
        isOpen={!!activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
      />
    </div>
  );
}
