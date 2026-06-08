// ============================================================================
// VOLKSCHEM OMS — Global Error Handler Middleware
// ============================================================================

const env = require('../config/env');

/**
 * Global error handler. Must be the LAST middleware registered.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
function errorHandler(err, req, res, _next) {
  // Log error details in development
  if (env.IS_DEV) {
    console.error('═══════════════════════════════════════');
    console.error('❌ Unhandled Error:');
    console.error('   Path:', req.method, req.originalUrl);
    console.error('   Message:', err.message);
    console.error('   Stack:', err.stack);
    console.error('═══════════════════════════════════════');
  } else {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`);
  }

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Build response
  const response = {
    success: false,
    data: null,
    message: statusCode === 500
      ? 'Internal server error. Please try again later.'
      : err.message,
    errors: null,
  };

  // In development, include the stack trace
  if (env.IS_DEV && statusCode === 500) {
    response.message = err.message;
    response.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === 'MulterError') {
    response.message = `File upload error: ${err.message}`;
    return res.status(400).json(response);
  }

  if (err.type === 'entity.parse.failed') {
    response.message = 'Invalid JSON in request body.';
    return res.status(400).json(response);
  }

  return res.status(statusCode).json(response);
}

module.exports = { errorHandler };
