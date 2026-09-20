import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  Store, 
  ShieldCheck, 
  MessageCircle, 
  AlertCircle, 
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

const ADMIN_WHATSAPP = '919999999999';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/supermarket');
      }
    } else {
      setError(res.message || 'Login failed. Please verify your credentials.');
    }
  };

  // Quick fill helper for testing
  const fillCredentials = (role) => {
    setError('');
    if (role === 'admin') {
      setEmail('admin@tastynam-keens.com');
      setPassword('Admin@TastyNamkeens2024');
    } else if (role === 'supermarket1') {
      setEmail('srilakshmi@example.com');
      setPassword('Supermarket@123');
    } else if (role === 'supermarket2') {
      setEmail('balaji@example.com');
      setPassword('Supermarket@456');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50/40 to-amber-100/50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Header Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-crimson to-brand-crimsonLight flex items-center justify-center font-black text-brand-gold text-2xl shadow-md group-hover:scale-105 transition-transform">
            TN
          </div>
          <span className="text-2xl font-black tracking-tight text-brand-charcoal">
            Tasty <span className="text-brand-crimson">Namkeens</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          Supermarket & Admin Portal
        </h2>
        <p className="mt-1 text-xs text-gray-600">
          Wholesale bulk order placement and store inventory management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-amber-900/10 rounded-3xl border border-amber-200/80 sm:px-10 space-y-6">
          {/* Role badge */}
          <div className="flex items-center justify-center gap-2 bg-amber-50 text-amber-900 text-xs font-bold py-2 px-3 rounded-xl border border-amber-200">
            <Lock className="w-3.5 h-3.5 text-brand-crimson" />
            <span>Authorized Accounts Only • No Public Signups</span>
          </div>

          {/* Error alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="supermarket@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 focus:border-brand-crimson focus:ring-2 focus:ring-red-100 rounded-xl text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 focus:border-brand-crimson focus:ring-2 focus:ring-red-100 rounded-xl text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-crimson to-red-700 hover:from-red-800 hover:to-brand-crimson text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-red-900/20 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials Quick Fillers */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block text-center">
              Quick-Fill Test Credentials:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin')}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold border border-amber-200 transition-colors"
              >
                🔐 Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('supermarket1')}
                className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-900 rounded-lg text-[11px] font-bold border border-red-200 transition-colors"
              >
                🏪 Store #1
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('supermarket2')}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-[11px] font-bold border border-blue-200 transition-colors"
              >
                🏪 Store #2
              </button>
            </div>
          </div>

          {/* Registration Notice */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2 text-center">
            <span className="text-xs font-bold text-emerald-950 block">
              Don't have a supermarket account yet?
            </span>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              Supermarket accounts are manually provisioned by the Tasty Namkeens Admin team after verification.
            </p>
            <a
              href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                'Hello Admin, I am a supermarket owner and I want to request a wholesale account on Tasty Namkeens.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>Request Account via WhatsApp</span>
            </a>
          </div>

          <div className="text-center">
            <Link to="/" className="text-xs font-semibold text-gray-500 hover:text-brand-crimson">
              &larr; Back to Public Snack Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
