import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, Menu, X, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img
              src="/images/logo.png"
              alt="Tasty Namkeens"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#products" className="hover:text-red-700 transition-colors">Products</a>
            <a href="#about" className="hover:text-red-700 transition-colors">About</a>
            <a href="#contact" className="hover:text-red-700 transition-colors">Contact</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-red-700 flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                {isSupermarket && (
                  <Link to="/supermarket" className="text-sm font-medium text-gray-600 hover:text-red-700 flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" /> Orders
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-700 flex items-center gap-1.5">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors flex items-center gap-1.5">
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-600">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <a href="#products" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Products</a>
          <a href="#about" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">About</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Contact</a>
          <hr className="border-gray-100" />
          {isAuthenticated ? (
            <>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Admin Dashboard</Link>}
              {isSupermarket && <Link to="/supermarket" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-gray-700 py-2">My Orders</Link>}
              <button onClick={handleLogout} className="block text-sm font-medium text-red-600 py-2">Logout</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-medium text-red-700 py-2">Login</Link>
          )}
        </div>
      )}
    </header>
  );
}
