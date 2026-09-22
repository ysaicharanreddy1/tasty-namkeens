import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SupermarketDashboard from './pages/SupermarketDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Guard for Supermarkets
function SupermarketRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'supermarket' && user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

// Protected Route Guard for Master Admin
function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public Home Page: Catalog + Store Finder */}
      <Route path="/" element={<HomePage />} />

      {/* Public Product Detail Page with Image Zoom */}
      <Route path="/products/:id" element={<ProductDetailPage />} />

      {/* Auth Login Page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Supermarket Portal (Protected) */}
      <Route
        path="/supermarket"
        element={
          <SupermarketRoute>
            <SupermarketDashboard />
          </SupermarketRoute>
        }
      />

      {/* Admin Panel (Protected) */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
