// ============================================================================
// VOLKSCHEM OMS — Admin Controller
// ============================================================================

const adminService = require('../services/adminService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

// ── Staff ───────────────────────────────────────────────────────────────────

async function getAllStaff(req, res, next) {
  try {
    const staff = await adminService.getAllStaff();
    return sendSuccess(res, staff, 'Staff list retrieved.');
  } catch (err) {
    next(err);
  }
}

async function createStaff(req, res, next) {
  try {
    const { username, password, role, full_name, phone, joining_date } = req.body;

    const errors = [];
    if (!username) errors.push('Username is required.');
    if (!password) errors.push('Password is required.');
    if (!role) errors.push('Role is required.');
    if (!['admin', 'employee', 'factory_admin'].includes(role)) errors.push('Invalid role.');
    if (!full_name) errors.push('Full name is required.');
    if (password && password.length < 6) errors.push('Password must be at least 6 characters.');
    if (errors.length > 0) return sendValidationError(res, errors);

    const user = await adminService.createStaff(
      { username, password, role, full_name, phone, joining_date },
      req.user.id
    );

    return sendSuccess(res, user, 'Staff member created.', 201);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function updateStaff(req, res, next) {
  try {
    const user = await adminService.updateStaff(req.params.id, req.body);
    return sendSuccess(res, user, 'Staff member updated.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { new_password } = req.body;
    if (!new_password || new_password.length < 6) {
      return sendValidationError(res, ['New password must be at least 6 characters.']);
    }

    const user = await adminService.resetPassword(req.params.id, new_password);
    return sendSuccess(res, user, 'Password reset successfully.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function toggleStatus(req, res, next) {
  try {
    const user = await adminService.toggleStatus(req.params.id);
    const action = user.is_active ? 'activated' : 'deactivated';
    return sendSuccess(res, user, `User ${action} successfully.`);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const user = await adminService.deleteStaff(req.params.id, req.user.id);
    return sendSuccess(res, user, 'User permanently deleted.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

// ── Logs ────────────────────────────────────────────────────────────────────

async function getLoginLogs(req, res, next) {
  try {
    const filters = {
      username: req.query.username,
      success: req.query.success !== undefined ? req.query.success === 'true' : undefined,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
      limit: req.query.limit ? parseInt(req.query.limit, 10) : 100,
    };

    const logs = await adminService.getLoginLogs(filters);
    return sendSuccess(res, logs, 'Login logs retrieved.');
  } catch (err) {
    next(err);
  }
}

async function clearLoginLogs(req, res, next) {
  try {
    await adminService.clearLoginLogs();
    return sendSuccess(res, null, 'All login logs cleared.');
  } catch (err) {
    next(err);
  }
}

// ── Dashboard ───────────────────────────────────────────────────────────────

async function getDashboard(req, res, next) {
  try {
    const stats = await adminService.getDashboardStats();
    return sendSuccess(res, stats, 'Dashboard stats retrieved.');
  } catch (err) {
    next(err);
  }
}

// ── Orders ──────────────────────────────────────────────────────────────────

async function getAllOrders(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      salesman: req.query.salesman,
      order_type: req.query.order_type,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
    };

    const orders = await adminService.getAllOrders(filters);
    return sendSuccess(res, orders, 'Orders retrieved.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllStaff,
  createStaff,
  updateStaff,
  resetPassword,
  toggleStatus,
  deleteStaff,
  getLoginLogs,
  clearLoginLogs,
  getDashboard,
  getAllOrders,
};
