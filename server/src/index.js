/**
 * index.js – Express Application Entry Point
 *
 * Startup sequence:
 *   1. Load environment variables from .env
 *   2. Connect to MongoDB
 *   3. Configure Express middleware (CORS, JSON parsing, etc.)
 *   4. Mount API route handlers
 *   5. Register global error handler
 *   6. Start HTTP server and log readiness
 */

// ── 1. Load environment variables (must be first!) ─────────────────────────
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// ── Route imports ──────────────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const storeRoutes   = require('./routes/storeRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const errorHandler  = require('./middleware/errorHandler');

// ── 2. Connect to MongoDB ──────────────────────────────────────────────────
connectDB();

// ── 3. Initialize Express app ─────────────────────────────────────────────
const app = express();

// ── 4. Core Middleware ─────────────────────────────────────────────────────

// CORS: allow requests from frontend (localhost, Vercel domains, or custom domain)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  ...(process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',').map((s) => s.trim()) : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);

      // Explicit match
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Dynamic match for Vercel deployment domains (*.vercel.app)
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) return callback(null, true);

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

// Parse incoming JSON bodies (max 10mb for product images as base64 if needed)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger (development only)
if (process.env.NODE_ENV === 'development') {
  app.use((req, _res, next) => {
    console.log(`📨  ${req.method} ${req.originalUrl}`);
    next();
  });
}

// ── 5. Mount Routes ────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/stores',   storeRoutes);
app.use('/api/admin',    adminRoutes);

// ── Health check endpoint ──────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🥜 Tasty Namkeens API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── 404 handler (must be after all routes) ─────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found. Check the URL and try again.',
  });
});

// ── 6. Global Error Handler (must be last middleware) ─────────────────────
app.use(errorHandler);

// ── 7. Start HTTP server ───────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`  🥜  Tasty Namkeens API Server`);
    console.log(`  🚀  Running on   : http://localhost:${PORT}`);
    console.log(`  🌍  Environment  : ${process.env.NODE_ENV || 'development'}`);
    console.log(`  📋  Health check : http://localhost:${PORT}/api/health`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  });

  // ── Graceful shutdown on unhandled errors ─────────────────────────────────
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err.message);
    if (server) {
      server.close(() => {
        console.log('🛑 Server closed due to unhandled rejection.');
        process.exit(1);
      });
    }
  });

  process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received. Shutting down gracefully...');
    if (server) {
      server.close(() => {
        console.log('🛑 Server closed.');
        process.exit(0);
      });
    }
  });
}

module.exports = app;
