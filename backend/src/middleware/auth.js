// ============================================================================
// VOLKSCHEM OMS — JWT Authentication Middleware
// ============================================================================

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const supabase = require('../config/db');
const { sendError } = require('../utils/response');

/**
 * Verifies JWT from Authorization: Bearer <token> header.
 * Attaches decoded user to req.user.
 * Checks user is_active status from database.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'Authentication required. Please provide a valid token.', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, 'Authentication required. Token is empty.', 401);
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token has expired. Please login again.', 401);
      }
      if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token. Please login again.', 401);
      }
      return sendError(res, 'Authentication failed.', 401);
    }

    // Check user still exists and is active
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, role, full_name, is_active')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return sendError(res, 'User account not found.', 401);
    }

    if (!user.is_active) {
      return sendError(res, 'Your account has been deactivated. Contact admin.', 401);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return sendError(res, 'Authentication failed.', 401);
  }
}

module.exports = { authenticate };
