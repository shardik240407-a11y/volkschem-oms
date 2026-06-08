// ============================================================================
// VOLKSCHEM OMS — Role Guard Middleware
// ============================================================================

const { sendError } = require('../utils/response');

/**
 * Creates a middleware that allows only the specified roles.
 * @param  {...string} roles
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      console.log('[ROLE GUARD] 401 - No req.user');
      return sendError(res, 'Authentication required.', 401);
    }
    if (!roles.includes(req.user.role)) {
      console.log(`[ROLE GUARD] 403 - Required: ${roles.join(',')}, Actual: ${req.user.role}, User: ${req.user.username}, Path: ${req.originalUrl}`);
      return sendError(
        res,
        `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}.`,
        403
      );
    }
    next();
  };
}

// Pre-built role guards
const allowAdmin = requireRole('admin');
const allowEmployee = requireRole('employee');
const allowFactory = requireRole('factory_admin');
const allowAdminAndEmployee = requireRole('admin', 'employee');
const allowAll = requireRole('admin', 'employee', 'factory_admin');

module.exports = {
  requireRole,
  allowAdmin,
  allowEmployee,
  allowFactory,
  allowAdminAndEmployee,
  allowAll,
};
