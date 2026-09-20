/**
 * authController.js – Authentication Controller
 *
 * POST /api/auth/login    → Supermarket / Admin login
 * GET  /api/auth/me       → Get current logged-in user (protected)
 * POST /api/auth/logout   → Logout (client-side token invalidation)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: Sign JWT and return token ─────────────────────────────────────
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ── Helper: Build a consistent response with token ────────────────────────
const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      storeRef: user.storeRef,
    },
  });
};

// ── POST /api/auth/login ───────────────────────────────────────────────────
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    // 2. Find user (explicitly select password – it's hidden by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 3. Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact admin.',
      });
    }

    // 4. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // 5. Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // 6. Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// ── GET /api/auth/me ───────────────────────────────────────────────────────
exports.getMe = async (req, res, next) => {
  try {
    // req.user is attached by the 'protect' middleware
    const user = await User.findById(req.user._id).populate('storeRef');

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/auth/logout ──────────────────────────────────────────────────
// JWT is stateless – logout is handled client-side by discarding the token.
// This endpoint exists for completeness and future cookie-based auth.
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully. Please remove the token from client storage.',
  });
};
