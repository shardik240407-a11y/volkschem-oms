// ============================================================================
// VOLKSCHEM OMS — Order Controller
// ============================================================================

const orderService = require('../services/orderService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

async function getOrders(req, res, next) {
  try {
    const filters = {
      status: req.query.status,
      from_date: req.query.from_date,
      to_date: req.query.to_date,
    };

    const data = await orderService.getOrders(req.user.role, filters);
    return sendSuccess(res, data, 'Orders retrieved.');
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status, note } = req.body;

    if (!status) {
      return sendValidationError(res, ['Status is required.']);
    }

    const data = await orderService.updateOrderStatus(
      req.params.id, status, note, req.user.id
    );
    return sendSuccess(res, data, `Order status updated to "${status}".`);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function uploadLR(req, res, next) {
  try {
    if (!req.file) {
      return sendValidationError(res, ['LR file is required.']);
    }

    const data = await orderService.uploadLR(req.params.id, req.file, req.user.id);
    return sendSuccess(res, data, 'LR document uploaded.', 201);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function getLR(req, res, next) {
  try {
    const data = await orderService.getLRAttachments(req.params.id, req.user.id, req.user.role);
    return sendSuccess(res, data, 'LR attachments retrieved.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function updateNote(req, res, next) {
  try {
    const { note } = req.body;
    const data = await orderService.updateOrderNote(req.params.id, note);
    return sendSuccess(res, data, 'Production note updated.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function getProgress(req, res, next) {
  try {
    const data = await orderService.getOrderProgress(req.params.id);
    return sendSuccess(res, data, 'Order progress timeline retrieved.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const data = await orderService.deleteOrder(req.params.id);
    return sendSuccess(res, data, 'Order deleted successfully.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function deleteLR(req, res, next) {
  try {
    const data = await orderService.deleteLRAttachments(req.params.id);
    return sendSuccess(res, data, 'LR attachments deleted.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

module.exports = {
  getOrders,
  updateStatus,
  uploadLR,
  getLR,
  updateNote,
  getProgress,
  deleteOrder,
  deleteLR,
};
