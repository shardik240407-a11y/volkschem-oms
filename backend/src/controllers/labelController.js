// ============================================================================
// VOLKSCHEM OMS — Label Controller
// ============================================================================

const labelService = require('../services/labelService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

async function getLabelStock(req, res, next) {
  try {
    const data = await labelService.getLabelStock(req.params.productId);
    return sendSuccess(res, data, 'Label stock retrieved.');
  } catch (err) {
    next(err);
  }
}

async function checkAvailability(req, res, next) {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return sendValidationError(res, ['Items array is required with at least one entry.']);
    }

    // Validate each item
    const errors = [];
    items.forEach((item, idx) => {
      if (!item.product_id) errors.push(`Item ${idx + 1}: product_id is required.`);
      if (!item.pack_type) errors.push(`Item ${idx + 1}: pack_type is required.`);
      if (!item.pack_size) errors.push(`Item ${idx + 1}: pack_size is required.`);
      if (!item.quantity_needed || item.quantity_needed <= 0) {
        errors.push(`Item ${idx + 1}: quantity_needed must be a positive number.`);
      }
    });
    if (errors.length > 0) return sendValidationError(res, errors);

    const result = await labelService.checkLabelAvailability(items);
    const message = result.ok ? 'Sufficient labels available.' : 'Insufficient labels for some items.';
    return sendSuccess(res, result, message);
  } catch (err) {
    next(err);
  }
}

async function addBatch(req, res, next) {
  try {
    const { product_id, pack_type, pack_size, quantity, batch_rate, notes } = req.body;

    const errors = [];
    if (!product_id) errors.push('Product ID is required.');
    if (!pack_type) errors.push('Pack type is required.');
    if (!pack_size) errors.push('Pack size is required.');
    if (!quantity || quantity <= 0) errors.push('Quantity must be a positive number.');
    if (errors.length > 0) return sendValidationError(res, errors);

    const data = await labelService.addLabelBatch(
      { product_id, pack_type, pack_size, quantity, batch_rate, notes },
      req.user.id
    );
    return sendSuccess(res, data, 'Label batch added.', 201);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function getTransactions(req, res, next) {
  try {
    const data = await labelService.getTransactionHistory(req.params.productId);
    return sendSuccess(res, data, 'Label transactions retrieved.');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getLabelStock,
  checkAvailability,
  addBatch,
  getTransactions,
};
