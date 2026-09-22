import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  ShoppingBag, 
  LogOut, 
  CheckCircle2, 
  Plus, 
  Minus, 
  MessageCircle, 
  Loader2, 
  ChevronRight,
  Eye
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Chikki',
  'Laddu',
  'Chakli',
  'Murukku',
  'Chips',
  'Roasted Snacks',
  'Mixed Snacks',
  'Peanut Snacks',
];

export default function SupermarketDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'my-orders'

  // Fetch wholesale catalog
  const fetchWholesaleCatalog = async () => {
    try {
      const res = await api.get('/products/wholesale');
      if (res.data?.success) {
        setProducts(res.data.data);
        const initialQtys = {};
        res.data.data.forEach((p) => {
          initialQtys[p._id] = p.minOrderQty || 10;
        });
        setQuantities(initialQtys);
      }
    } catch (err) {
      console.error('Failed to load wholesale catalog:', err);
    }
  };

  // Fetch past orders
  const fetchMyOrders = async () => {
    try {
      const res = await api.get('/orders/my-orders');
      if (res.data?.success) {
        setOrders(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchWholesaleCatalog(), fetchMyOrders()]);
      setLoading(false);
    };
    loadData();
  }, [user, navigate]);

  const handleQtyChange = (productId, delta, minQty) => {
    setQuantities((prev) => {
      const current = prev[productId] || minQty;
      const nextVal = Math.max(minQty, current + delta);
      return { ...prev, [productId]: nextVal };
    });
  };

  const handlePlaceOrder = async (product) => {
    const qty = quantities[product._id] || product.minOrderQty;
    setOrderSubmitting(true);
    setOrderSuccess(null);

    try {
      const payload = {
        items: [
          {
            productId: product._id,
            quantity: qty,
          },
        ],
      };

      const res = await api.post('/orders', payload);
      if (res.data?.success) {
        setOrderSuccess(`Order placed successfully for ${qty} packets of ${product.name}! Total: ₹${qty * product.wholesalePrice}`);
        await fetchMyOrders();
        setActiveTab('my-orders');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Supermarket Header with Real Logo */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <img
                src="/images/logo.png"
                alt="Tasty Namkeens"
                className="h-10 w-auto"
              />
            </Link>
            <span className="text-xs bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full font-semibold">
              Supermarket Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-gray-900">{user?.name}</div>
              <div className="text-[10px] text-gray-500">@{user?.username || user?.email}</div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-red-50 py-1.5 px-3 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'catalog'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Wholesale Catalog
          </button>
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'my-orders'
                ? 'border-red-700 text-red-700'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Order History ({orders.length})
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {orderSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{orderSuccess}</span>
            </div>
            <button
              onClick={() => setOrderSuccess(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-gray-400 space-y-2">
            <Loader2 className="w-8 h-8 text-red-700 animate-spin mx-auto" />
            <p className="text-xs">Loading wholesale inventory...</p>
          </div>
        ) : activeTab === 'catalog' ? (
          <div className="space-y-6">
            {/* Category filter pills */}
            <div className="flex items-center flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-red-700 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Wholesale items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => {
                const qty = quantities[p._id] || p.minOrderQty;
                const totalItemCost = qty * p.wholesalePrice;

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                  >
                    {/* Clickable Image & Header to open Product Page */}
                    <div>
                      <Link
                        to={`/products/${p._id}`}
                        className="block aspect-video w-full rounded-lg overflow-hidden bg-gray-50 relative group mb-3"
                      >
                        <img
                          src={p.imageUrl || '/images/placeholder-snack.png'}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/90 text-gray-900 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> View & Zoom Item
                          </span>
                        </div>
                      </Link>

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-semibold text-gray-500 uppercase">
                            {p.category}
                          </span>
                          <Link to={`/products/${p._id}`}>
                            <h3 className="font-semibold text-sm text-gray-900 hover:text-red-700 transition-colors">
                              {p.name}
                            </h3>
                          </Link>
                          <span className="text-xs text-gray-400">Net Weight: {p.netWeight}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-bold text-red-700 block">
                            ₹{p.wholesalePrice}
                          </span>
                          <span className="text-[10px] text-gray-400">Wholesale / pkt</span>
                          {p.mrp && (
                            <span className="text-[10px] text-gray-400 block line-through">
                              MRP ₹{p.mrp}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <span>Min Order Qty: </span>
                        <span className="font-semibold text-gray-800">{p.minOrderQty} packets</span>
                      </div>
                    </div>

                    {/* Quantity Selector & Order CTA */}
                    <div className="space-y-2.5 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQtyChange(p._id, -5, p.minOrderQty)}
                            disabled={qty <= p.minOrderQty}
                            className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center font-semibold text-xs text-gray-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQtyChange(p._id, 5, p.minOrderQty)}
                            className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                        <span>Total:</span>
                        <span className="text-red-700 font-bold text-sm">₹{totalItemCost}</span>
                      </div>

                      <button
                        onClick={() => handlePlaceOrder(p)}
                        disabled={orderSubmitting}
                        className="w-full inline-flex items-center justify-center gap-1.5 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Place Order ({qty} pkts)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* My Orders tab */
          <div className="space-y-4">
            <h2 className="text-base font-bold text-gray-900">Wholesale Order History</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200 space-y-2">
                <p className="text-xs text-gray-500">No orders placed yet.</p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline"
                >
                  Browse Catalog &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2">
                      <div>
                        <span className="text-[11px] font-mono text-gray-400 block">
                          Order #{ord._id.slice(-6)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                            ord.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.status === 'Dispatched'
                              ? 'bg-blue-50 text-blue-700'
                              : ord.status === 'Delivered'
                              ? 'bg-green-50 text-green-800'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          ● {ord.status}
                        </span>
                        <span className="text-sm font-bold text-red-700">
                          ₹{ord.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1 text-xs text-gray-700">
                      {ord.items?.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.productName} ({item.netWeight}) &times; {item.quantity} pkts
                          </span>
                          <span className="font-medium text-gray-900">
                            ₹{item.priceAtOrder * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
