/**
 * errorHandler.js – Global Express Error Handling Middleware
 *
 * Catches all errors thrown or passed via next(err) and returns
 * a consistent JSON error response.
 *
 * Must be registered LAST in the middleware chain in index.js.
 */

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose: Invalid ObjectId (CastError) ─────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 404;
    message = `Resource not found. Invalid ID: ${err.value}`;
  }

  // ── Mongoose: Duplicate key (e.g., duplicate email) ────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field "${field}". Please use a different value.`;
  }

  // ── Mongoose: Validation errors ────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('. ');
  }

  // ── JWT: Token errors ──────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired. Please log in again.';
  }

  // Log unexpected server errors (don't log client-side 4xx)
  if (statusCode >= 500) {
    console.error('🔥 Server Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Show stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
