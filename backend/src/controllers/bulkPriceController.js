// ============================================================================
// VOLKSCHEM OMS — Bulk Price Controller
// ============================================================================

const bulkPriceService = require('../services/bulkPriceService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

async function getAllBulkPrices(req, res, next) {
  try {
    const data = await bulkPriceService.getAllBulkPrices();
    return sendSuccess(res, data, 'Bulk prices retrieved.');
  } catch (err) {
    next(err);
  }
}

async function searchBulkPrices(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      return sendValidationError(res, ['Query parameter "q" is required.']);
    }

    const data = await bulkPriceService.searchBulkPrices(q);
    return sendSuccess(res, data, `Search results for "${q}".`);
  } catch (err) {
    next(err);
  }
}

async function createBulkPrice(req, res, next) {
  try {
    const { material_name, rate_per_unit, unit } = req.body;

    const errors = [];
    if (!material_name) errors.push('Material name is required.');
    if (!rate_per_unit || isNaN(rate_per_unit)) errors.push('Rate per unit must be a valid number.');
    if (!unit) errors.push('Unit is required.');
    if (errors.length > 0) return sendValidationError(res, errors);

    const data = await bulkPriceService.createBulkPrice(req.body, req.user.id);
    return sendSuccess(res, data, 'Bulk price created.', 201);
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function updateBulkPrice(req, res, next) {
  try {
    const data = await bulkPriceService.updateBulkPrice(req.params.id, req.body, req.user.id);
    return sendSuccess(res, data, 'Bulk price updated.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function deleteBulkPrice(req, res, next) {
  try {
    const data = await bulkPriceService.deleteBulkPrice(req.params.id);
    return sendSuccess(res, data, 'Bulk price deleted.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

module.exports = {
  getAllBulkPrices,
  searchBulkPrices,
  createBulkPrice,
  updateBulkPrice,
  deleteBulkPrice,
};
