// ============================================================================
// VOLKSCHEM OMS — Auth Controller
// ============================================================================

const authService = require('../services/authService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    console.log('[AUTH DEBUG] Login attempt:', { username, hasPassword: !!password, bodyKeys: Object.keys(req.body) });

    // Validate
    const errors = [];
    if (!username) errors.push('Username is required.');
    if (!password) errors.push('Password is required.');
    if (errors.length > 0) return sendValidationError(res, errors);

    const result = await authService.login(username, password, {
      ip: req.ip || req.connection?.remoteAddress,
      userAgent: req.get('user-agent'),
    });

    console.log('[AUTH DEBUG] Login successful for:', username);
    return sendSuccess(res, result, 'Login successful.');
  } catch (err) {
    console.log('[AUTH DEBUG] Login failed:', err.message, err.statusCode);
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function logout(req, res) {
  // Stateless JWT — logout is handled client-side by discarding the token.
  // If needed, implement token blacklisting with Redis in the future.
  return sendSuccess(res, null, 'Logged out successfully.');
}

async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, user, 'Current user retrieved.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

module.exports = { login, logout, getMe };
