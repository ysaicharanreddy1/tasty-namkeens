import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppChat from '../components/WhatsAppChat';
import StoreFinderModal from '../components/StoreFinderModal';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';
import { ArrowLeft, Store, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  // Zoom on hover state
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, listRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get('/products')
        ]);

        if (prodRes.data?.success) {
          setProduct(prodRes.data.data);
        } else {
          setError('Product not found.');
        }

        if (listRes.data?.success) {
          setAllProducts(listRes.data.data || []);
        }
      } catch (err) {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  // Other products (exclude current product)
  const otherProducts = allProducts.filter((p) => p._id !== id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        {/* Breadcrumb / Back button */}
        <div className="mb-6 flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-red-700 flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          {product && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-400">{product.category}</span>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <span className="text-gray-700 font-semibold truncate">{product.name}</span>
            </>
          )}
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-8 h-8 text-red-700 animate-spin" />
            <p className="text-sm">Loading product details...</p>
          </div>
        ) : error || !product ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-gray-600 text-sm">{error || 'Product not found.'}</p>
            <Link
              to="/"
              className="inline-block bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-red-800"
            >
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Main Product Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
              {/* Left: Big Product Image with Cursor-Follow Zoom */}
              <div className="space-y-3">
                <div
                  ref={imageContainerRef}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onMouseMove={handleMouseMove}
                  className="relative aspect-square w-full bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden cursor-crosshair shadow-md select-none"
                >
                  <img
                    src={product.imageUrl || '/images/placeholder-snack.png'}
                    alt={product.name}
                    style={{
                      transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      transform: isHovered ? 'scale(2.5)' : 'scale(1)',
                      transition: isHovered ? 'transform 0.05s ease-out' : 'transform 0.3s ease-out',
                    }}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-snack.png';
                    }}
                  />

                  {/* Hover indicator badge */}
                  {!isHovered && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] px-2.5 py-1 rounded-md backdrop-blur-sm pointer-events-none">
                      Hover to zoom
                    </div>
                  )}
                </div>
                <p className="text-center text-xs text-gray-400">
                  Move your mouse onto the picture to zoom into that exact spot and see details clearly.
                </p>
              </div>

              {/* Right: Product Info */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-1 rounded-md">
                    {product.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2.5">
                    {product.name}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Net Weight: <span className="font-semibold text-gray-800">{product.netWeight}</span>
                  </p>
                </div>

                {/* Pricing */}
                {product.mrp && (
                  <div className="border-t border-b border-gray-100 py-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-red-700">₹{product.mrp}/-</span>
                      <span className="text-xs text-gray-400 font-medium">MRP (Incl. of all taxes)</span>
                    </div>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      Description
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Ingredients */}
                {product.ingredients && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                      Ingredients
                    </h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {product.ingredients}
                    </p>
                  </div>
                )}

                {/* Quality certification */}
                <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-900 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold">FSSAI Certified Food Safety: 23624030002668</p>
                    <p className="text-emerald-700 text-[11px]">Packed by S.V. Enterprises, Borabanda, Hyderabad</p>
                  </div>
                </div>

                {/* Find Nearby Store CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setActiveModalProduct(product);
                      setModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 px-6 rounded-xl font-semibold text-sm transition-colors shadow-sm"
                  >
                    <Store className="w-4 h-4" />
                    <span>Find Nearby Store Carrying This Item</span>
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">
                    Check retail supermarkets currently stocking this product
                  </p>
                </div>
              </div>
            </div>

            {/* Down Section: All other products displayed (4 per row) */}
            <div className="border-t border-gray-200 pt-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Explore More Snacks</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Other popular authentic varieties from Tasty Namkeens</p>
                </div>
                <Link to="/" className="text-xs font-semibold text-red-700 hover:underline">
                  View All &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {otherProducts.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    onFindStore={(selected) => {
                      setActiveModalProduct(selected);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppChat />

      {(activeModalProduct || product) && (
        <StoreFinderModal
          product={activeModalProduct || product}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setActiveModalProduct(null);
          }}
        />
      )}
    </div>
  );
}
