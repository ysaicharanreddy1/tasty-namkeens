import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Menu, X, ShoppingBag, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isSupermarket, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Prominent, Big, Clean Company Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/images/logo.png"
              alt="Tasty Namkeens"
              className="h-16 sm:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-base font-semibold text-gray-700">
            <a href="#products" className="hover:text-red-700 transition-colors">
              Products
            </a>
            <a href="#about" className="hover:text-red-700 transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-red-700 transition-colors">
              Contact
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-semibold text-gray-700 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                {isSupermarket && (
                  <Link
                    to="/supermarket"
                    className="text-sm font-semibold text-gray-700 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <ShoppingBag className="w-4 h-4" /> Orders
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold text-gray-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600 rounded-lg hover:bg-gray-100"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          <a
            href="#products"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-semibold text-gray-700 py-2"
          >
            Products
          </a>
          <a
            href="#about"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-semibold text-gray-700 py-2"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block text-base font-semibold text-gray-700 py-2"
          >
            Contact
          </a>
          <hr className="border-gray-100" />
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-semibold text-gray-700 py-2"
                >
                  Admin Dashboard
                </Link>
              )}
              {isSupermarket && (
                <Link
                  to="/supermarket"
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-semibold text-gray-700 py-2"
                >
                  My Orders
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block text-sm font-semibold text-red-600 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-bold text-red-700 py-2"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
