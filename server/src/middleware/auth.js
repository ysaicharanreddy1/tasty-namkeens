/**
 * auth.js – JWT Authentication & RBAC Middleware
 *
 * protect()    → Verifies the JWT token. Blocks unauthenticated requests.
 * authorize()  → Checks that the authenticated user has the required role(s).
 *
 * Usage:
 *   router.get('/admin-only', protect, authorize('admin'), handler)
 *   router.get('/b2b-route',  protect, authorize('admin', 'supermarket'), handler)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── protect: Verify JWT ─────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  let token;

  // Accept token from Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Fallback: accept token from an httpOnly cookie (for future web sessions)
  // if (!token && req.cookies?.token) token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.',
    });
  }

  try {
    // Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user document to the request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!req.user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact admin.',
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or has expired. Please log in again.',
    });
  }
};

// ── authorize: Role-based access control ───────────────────────────────────
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role "${req.user.role}" is not allowed to access this route.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
