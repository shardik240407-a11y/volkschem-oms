// ============================================================================
// VOLKSCHEM OMS — Cost Sheet Controller
// ============================================================================

const costSheetService = require('../services/costSheetService');
const { sendSuccess, sendError, sendValidationError } = require('../utils/response');

async function getAllRates(req, res, next) {
  try {
    const result = await costSheetService.getAllRates();
    return sendSuccess(res, result, 'Cost sheet rates retrieved.');
  } catch (err) {
    next(err);
  }
}

async function getRatesByCategory(req, res, next) {
  try {
    const { category } = req.params;
    const rates = await costSheetService.getRatesByCategory(category);
    return sendSuccess(res, rates, `Rates for category "${category}" retrieved.`);
  } catch (err) {
    next(err);
  }
}

async function lookupRate(req, res, next) {
  try {
    const { category, item, size } = req.query;

    if (!category) {
      return sendValidationError(res, ['Query parameter "category" is required.']);
    }

    const rates = await costSheetService.lookupRate(category, item, size);
    return sendSuccess(res, rates, 'Rate lookup results.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function updateRate(req, res, next) {
  try {
    const { rate } = req.body;

    if (rate === undefined || rate === null || isNaN(rate)) {
      return sendValidationError(res, ['A valid numeric rate is required.']);
    }

    const updated = await costSheetService.updateRate(
      req.params.id,
      parseFloat(rate),
      req.user.id
    );
    return sendSuccess(res, updated, 'Rate updated. Only future quotations will use this rate.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

async function createRate(req, res, next) {
  try {
    const { category, item_name, size, rate } = req.body;
    if (!category || !item_name || !size || rate === undefined || rate === null || isNaN(rate)) {
      return sendValidationError(res, ['Fields required: category, item_name, size, rate']);
    }
    const created = await costSheetService.createRate(
      { category, item_name, size, rate: parseFloat(rate) },
      req.user.id
    );
    return sendSuccess(res, created, 'Cost sheet item created.', 201);
  } catch (err) {
    next(err);
  }
}

async function deleteRate(req, res, next) {
  try {
    await costSheetService.deleteRate(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Cost sheet item deleted.');
  } catch (err) {
    if (err.statusCode) return sendError(res, err.message, err.statusCode);
    next(err);
  }
}

module.exports = {
  getAllRates,
  getRatesByCategory,
  lookupRate,
  updateRate,
  createRate,
  deleteRate,
};
