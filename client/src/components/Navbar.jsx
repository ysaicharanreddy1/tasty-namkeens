import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Store, 
  MessageCircle, 
  LogIn, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';

const ADMIN_WHATSAPP = '919999999999';
const WHATSAPP_REGISTRATION_URL = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
  'Hello Admin, I am a supermarket owner and I want to register my store on Tasty Namkeens to place wholesale snack orders.'
)}`;

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isSupermarket, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      {/* Top Notification Bar for B2B Supermarkets */}
      <div className="bg-brand-crimson text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-gold animate-pulse" />
        <span>Wholesale B2B Platform • Verified Supermarket Accounts Only • Direct Manufacturer Supply</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-crimson to-brand-crimsonLight flex items-center justify-center shadow-md shadow-red-900/20 group-hover:scale-105 transition-transform">
              <span className="text-2xl font-black text-brand-gold select-none">TN</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-brand-charcoal group-hover:text-brand-crimson transition-colors">
                Tasty <span className="text-brand-crimson">Namkeens</span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">
                Premium Indian Snack Crafters
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
            <a href="#catalog" className="hover:text-brand-crimson transition-colors">
              Our Snacks (50+)
            </a>
            <a href="#stores" className="hover:text-brand-crimson transition-colors">
              Find Stores
            </a>
            <a href="#about" className="hover:text-brand-crimson transition-colors">
              About Us
            </a>
            <a href="#b2b-info" className="hover:text-brand-crimson transition-colors">
              B2B Wholesale
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* WhatsApp Registration CTA */}
            <a
              href={WHATSAPP_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-lg font-bold text-xs tracking-wide shadow-sm hover:shadow transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Supermarket Registration</span>
            </a>

            {/* Auth Button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 bg-brand-crimson text-white px-4 py-2.5 rounded-lg font-bold text-xs hover:bg-brand-crimsonLight transition-colors shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    to="/supermarket"
                    className="inline-flex items-center gap-2 bg-brand-crimson text-white px-4 py-2.5 rounded-lg font-bold text-xs hover:bg-brand-crimsonLight transition-colors shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 text-brand-gold" />
                    <span>Wholesale Portal</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 border-2 border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-white px-4 py-2 rounded-lg font-bold text-xs tracking-wide transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-700 hover:text-brand-crimson hover:bg-amber-50 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-amber-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <a
            href="#catalog"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-brand-crimson"
          >
            Our Snacks (50+)
          </a>
          <a
            href="#stores"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-brand-crimson"
          >
            Find Stores
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-brand-crimson"
          >
            About Us
          </a>
          <a
            href="#b2b-info"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-semibold text-gray-800 hover:text-brand-crimson"
          >
            B2B Wholesale Info
          </a>

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href={WHATSAPP_REGISTRATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-bold text-sm shadow"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Supermarket Registration via WhatsApp</span>
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/supermarket'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-brand-crimson text-white py-3 rounded-lg font-bold text-sm"
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{isAdmin ? 'Admin Panel' : 'Supermarket Portal'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out ({user?.name})</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 border-2 border-brand-crimson text-brand-crimson py-2.5 rounded-lg font-bold text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Portal Login (Supermarket / Admin)</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
