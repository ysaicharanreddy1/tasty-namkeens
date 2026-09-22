import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User as UserIcon, AlertCircle, ArrowRight, Eye, EyeOff, MessageCircle } from 'lucide-react';

const ADMIN_WHATSAPP = '919908478783';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    const res = await login(username.trim(), password);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Logo Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
          <img
            src="/images/logo.png"
            alt="Tasty Namkeens"
            className="h-16 w-auto mx-auto"
          />
        </Link>
        <h2 className="text-xl font-bold text-gray-900">
          Supermarket & Admin Portal
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Sign in with your assigned username and password
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-2xl border border-gray-200 sm:px-8 space-y-5">
          {/* Error alert */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 focus:border-red-700 focus:ring-1 focus:ring-red-700 rounded-lg text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2 bg-white border border-gray-300 focus:border-red-700 focus:ring-1 focus:ring-red-700 rounded-lg text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Need Account Box */}
          <div className="pt-4 border-t border-gray-100 text-center space-y-2">
            <p className="text-xs text-gray-500">
              Don't have a supermarket wholesale account yet?
            </p>
            <a
              href={`https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
                'Hello Admin, I am a supermarket owner and I want to request a wholesale account on Tasty Namkeens.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors w-full"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Request Account via WhatsApp</span>
            </a>
          </div>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs font-medium text-gray-500 hover:text-red-700">
              &larr; Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
