import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { 
  ShieldCheck, 
  Store, 
  Package, 
  ShoppingBag, 
  Users, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Phone,
  Mail,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'supermarkets' | 'create-user'

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserUsername, setNewUserUsername] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserCity, setNewUserCity] = useState('');
  const [newUserStreet, setNewUserStreet] = useState('');
  const [formMsg, setFormMsg] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, ordersRes, usersRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/orders'),
        api.get('/admin/users'),
      ]);

      if (dashRes.data?.success) setStats(dashRes.data.stats);
      if (ordersRes.data?.success) setOrders(ordersRes.data.data);
      if (usersRes.data?.success) setUsersList(usersRes.data.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      await loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleToggleUser = async (userId) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle`);
      await loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleCreateSupermarket = async (e) => {
    e.preventDefault();
    setFormMsg(null);
    try {
      const res = await api.post('/admin/users', {
        name: newUserName,
        username: newUserUsername.trim().toLowerCase(),
        email: newUserEmail.trim().toLowerCase(),
        password: newUserPassword,
        phone: newUserPhone,
        address: {
          street: newUserStreet,
          city: newUserCity,
          state: 'Telangana',
          pincode: '500001',
        },
      });

      if (res.data?.success) {
        setFormMsg({ type: 'success', text: `Supermarket account created for ${newUserName} (Username: ${newUserUsername || newUserName})!` });
        setNewUserName('');
        setNewUserUsername('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserPhone('');
        setNewUserCity('');
        setNewUserStreet('');
        await loadDashboardData();
      }
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create user' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col">
      {/* Admin Header */}
      <header className="bg-white border-b border-amber-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="shrink-0">
              <img
                src="/images/logo.png"
                alt="Tasty Namkeens"
                className="h-10 w-auto"
              />
            </Link>
            <span className="text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-crimson" />
              <span>Master Admin Console</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-gray-900">{user?.name}</div>
              <div className="text-[10px] text-gray-500">Super Admin</div>
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
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-brand-crimson text-brand-crimson'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            📦 Incoming Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('supermarkets')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'supermarkets'
                ? 'border-brand-crimson text-brand-crimson'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            🏪 Registered Supermarkets ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('create-user')}
            className={`py-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'create-user'
                ? 'border-brand-crimson text-brand-crimson'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            ➕ Issue Supermarket Credentials
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Catalog Items</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-charcoal mt-1">
              {stats?.totalProducts ?? '50+'}
            </div>
            <span className="text-[11px] text-gray-400">Varieties</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Retail Stores</div>
            <div className="text-2xl sm:text-3xl font-black text-brand-crimson mt-1">
              {stats?.totalStores ?? 2}
            </div>
            <span className="text-[11px] text-gray-400">Mapped in Finder</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Pending Orders</div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">
              {stats?.pendingOrders ?? 0}
            </div>
            <span className="text-[11px] text-gray-400">Awaiting Dispatch</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm">
            <div className="text-xs font-bold text-gray-500 uppercase">Supermarket Users</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {stats?.totalSupermarkets ?? 2}
            </div>
            <span className="text-[11px] text-gray-400">Active Retailers</span>
          </div>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900">Incoming Wholesale Bulk Orders</h2>
              <span className="text-xs text-gray-500">Update order fulfillment status live</span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 space-y-2">
                <p className="text-gray-500 text-sm">No wholesale orders recorded in database.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord._id}
                    className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                      <div>
                        <div className="text-base font-extrabold text-gray-900">
                          {ord.supermarketName || ord.supermarket?.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          Contact: {ord.supermarket?.phone || 'On file'} • Placed on:{' '}
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-brand-crimson">
                          ₹{ord.totalAmount}
                        </span>
                        {/* Status dropdown */}
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateStatus(ord._id, e.target.value)}
                          className="bg-amber-50 border border-amber-300 text-xs font-bold text-amber-950 py-1.5 px-3 rounded-lg outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Items table */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                      {ord.items?.map((item, i) => (
                        <div key={i} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex justify-between">
                          <span>
                            <strong>{item.productName}</strong> ({item.netWeight})
                          </span>
                          <span className="font-bold text-gray-900">
                            {item.quantity} pkts @ ₹{item.priceAtOrder}
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

        {/* Tab 2: Supermarkets List */}
        {activeTab === 'supermarkets' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900">Authorized Supermarkets</h2>
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-amber-50/80 text-amber-900 border-b border-amber-200">
                  <tr>
                    <th className="p-4 font-bold uppercase">Store Name</th>
                    <th className="p-4 font-bold uppercase">Username</th>
                    <th className="p-4 font-bold uppercase">Phone</th>
                    <th className="p-4 font-bold uppercase">City</th>
                    <th className="p-4 font-bold uppercase">Status</th>
                    <th className="p-4 font-bold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {usersList.map((u) => (
                    <tr key={u._id} className="hover:bg-amber-50/20">
                      <td className="p-4 font-bold text-gray-900">{u.name}</td>
                      <td className="p-4 text-gray-600 font-mono">@{u.username || '—'}</td>
                      <td className="p-4 text-gray-600">{u.phone || '—'}</td>
                      <td className="p-4 text-gray-600">{u.address?.city || 'Hyderabad'}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleUser(u._id)}
                          className="text-xs font-bold text-brand-crimson hover:underline"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Create Supermarket Account (No public signup) */}
        {activeTab === 'create-user' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-amber-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900">Issue Supermarket Credentials</h2>
              <p className="text-xs text-gray-500 mt-1">
                Since there is no public registration, create accounts here after verifying the supermarket on WhatsApp.
              </p>
            </div>

            {formMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold ${
                  formMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                    : 'bg-red-50 text-red-900 border border-red-300'
                }`}
              >
                {formMsg.text}
              </div>
            )}

            <form onSubmit={handleCreateSupermarket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Store / Supermarket Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Royal Supermarket"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Login Username</label>
                <input
                  type="text"
                  required
                  value={newUserUsername}
                  onChange={(e) => setNewUserUsername(e.target.value)}
                  placeholder="e.g. royalsupermarket"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Contact Email (Optional)</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. royal@example.com"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newUserCity}
                    onChange={(e) => setNewUserCity(e.target.value)}
                    placeholder="Hyderabad"
                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newUserStreet}
                  onChange={(e) => setNewUserStreet(e.target.value)}
                  placeholder="Main Road, Ameerpet"
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm outline-none focus:border-brand-crimson"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brand-crimson hover:bg-brand-crimsonLight text-white py-3 rounded-xl font-bold text-sm shadow transition-colors"
              >
                Create & Authorize Supermarket
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
