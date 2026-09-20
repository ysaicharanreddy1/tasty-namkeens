import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  ShoppingBag, 
  Store, 
  LogOut, 
  Package, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Minus,
  MessageCircle,
  Loader2,
  ChevronRight
} from 'lucide-react';

export default function SupermarketDashboard() {
  const { user, logout, isSupermarket, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quantities, setQuantities] = useState({});
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
        // Initialize default quantities to minOrderQty
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

  // Fetch my past orders
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

  // Place single item order or bulk order
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

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      {/* Supermarket Header */}
      <header className="bg-white border-b border-amber-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-brand-crimson text-brand-gold font-black flex items-center justify-center text-lg">
                TN
              </div>
              <span className="font-extrabold text-xl text-gray-900 hidden sm:inline">
                Tasty Namkeens
              </span>
            </Link>
            <span className="text-xs bg-red-100 text-brand-crimson px-2.5 py-0.5 rounded-full font-bold">
              Supermarket Wholesale Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-gray-900">{user?.name}</div>
              <div className="text-[10px] text-gray-500">{user?.email}</div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-red-700 bg-gray-100 hover:bg-red-50 py-2 px-3 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8 border-t border-gray-100">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'catalog'
                ? 'border-brand-crimson text-brand-crimson'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            📦 Wholesale Catalog & Bulk Ordering
          </button>
          <button
            onClick={() => setActiveTab('my-orders')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'my-orders'
                ? 'border-brand-crimson text-brand-crimson'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            📋 Order History ({orders.length})
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {orderSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm">
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
          <div className="py-24 text-center text-gray-500 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-crimson animate-spin mx-auto" />
            <p className="text-xs font-bold">Fetching wholesale inventory & bulk rates...</p>
          </div>
        ) : activeTab === 'catalog' ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">Supermarket Partner Pricing Active</h2>
                <p className="text-xs text-amber-100 mt-0.5">
                  All orders are packaged factory-fresh in protective cartons and dispatched within 48 hours.
                </p>
              </div>
              <a
                href="https://wa.me/919999999999?text=Hi%20Admin,%20need%20assistance%20with%20wholesale%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-amber-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-amber-50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366] fill-current" />
                <span>Contact Admin via WhatsApp</span>
              </a>
            </div>

            {/* Wholesale items list */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const qty = quantities[p._id] || p.minOrderQty;
                const totalItemCost = qty * p.wholesalePrice;

                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl border-2 border-amber-200/80 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded uppercase">
                            {p.category}
                          </span>
                          <h3 className="font-extrabold text-base text-gray-900 mt-1">{p.name}</h3>
                          <span className="text-xs text-gray-500">Weight: {p.netWeight}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-black text-brand-crimson block">
                            ₹{p.wholesalePrice}
                          </span>
                          <span className="text-[10px] text-gray-400">/ packet (Wholesale)</span>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-amber-50/70 rounded-xl border border-amber-100 text-xs text-gray-700">
                        <span className="font-bold text-brand-crimson">Min Order Qty: </span>
                        <span>{p.minOrderQty} packets</span>
                      </div>
                    </div>

                    {/* Quantity Selector & Order CTA */}
                    <div className="space-y-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-600">Order Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQtyChange(p._id, -5, p.minOrderQty)}
                            disabled={qty <= p.minOrderQty}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold disabled:opacity-30"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-12 text-center font-bold text-sm text-gray-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQtyChange(p._id, 5, p.minOrderQty)}
                            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                        <span>Total Line Amount:</span>
                        <span className="text-brand-crimson font-black text-sm">₹{totalItemCost}</span>
                      </div>

                      <button
                        onClick={() => handlePlaceOrder(p)}
                        disabled={orderSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 bg-brand-crimson hover:bg-brand-crimsonLight text-white py-2.5 rounded-xl font-bold text-xs tracking-wide shadow transition-colors disabled:opacity-50"
                      >
                        <ShoppingBag className="w-4 h-4 text-brand-gold" />
                        <span>Place Wholesale Order ({qty} pkts)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* My Orders tab */
          <div className="space-y-6">
            <h2 className="text-xl font-black text-gray-900">Wholesale Order History</h2>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 space-y-3">
                <div className="text-3xl">📦</div>
                <h3 className="font-bold text-gray-800 text-sm">No wholesale orders placed yet</h3>
                <p className="text-xs text-gray-500">
                  Select snacks from the catalog tab and place your first bulk consignment order.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-crimson hover:underline"
                >
                  <span>Go to Wholesale Catalog</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-white rounded-2xl border border-amber-200/80 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <span className="text-[11px] font-mono text-gray-400 block">
                          Order ID: {ord._id}
                        </span>
                        <span className="text-xs text-gray-500">
                          Placed on: {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            ord.status === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Dispatched'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'Delivered'
                              ? 'bg-green-100 text-green-900'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          ● {ord.status}
                        </span>
                        <span className="text-base font-black text-brand-crimson">
                          Total: ₹{ord.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Order line items */}
                    <div className="space-y-2">
                      {ord.items?.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-gray-700">
                          <span>
                            <strong>{item.productName}</strong> ({item.netWeight}) &times; {item.quantity} packets
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₹{item.priceAtOrder * item.quantity} (₹{item.priceAtOrder}/pkt)
                          </span>
                        </div>
                      ))}
                    </div>

                    {ord.adminNote && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                        <strong>Admin Note: </strong>
                        <span>{ord.adminNote}</span>
                      </div>
                    )}
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
