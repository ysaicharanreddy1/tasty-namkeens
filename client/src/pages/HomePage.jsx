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

      <main className="flex-1 w-full">
        {/* Full-width Hero Banner with smooth slide-down animation */}
        <Hero />

        {/* Full-width edge-to-edge Products Section */}
        <section id="products" className="py-14 sm:py-20 w-full px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Our Best Sellers
            </h2>
            <p className="mt-2 text-base text-gray-500">
              Browse our handcrafted wholesale snack catalog
            </p>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          <div className="mt-8">
            {loading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="w-10 h-10 text-red-700 animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-base">
                No products matched your search.{' '}
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="text-red-700 font-bold hover:underline ml-1"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              /* Edge-to-edge 4 products per row, big and spacious with large gaps */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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

        {/* Full-width About Section */}
        <section id="about" className="py-16 sm:py-24 bg-gray-50 border-t border-gray-200 w-full px-4 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              About Tasty Namkeens
            </h2>
            <div className="pt-4 flex items-center justify-center gap-10 sm:gap-16">
              <div>
                <div className="text-3xl sm:text-4xl font-black text-red-700">15+</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mt-1">Snack Varieties</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-red-700">FSSAI</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mt-1">Certified Food Safety</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-black text-red-700">100%</div>
                <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mt-1">Vegetarian</div>
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
