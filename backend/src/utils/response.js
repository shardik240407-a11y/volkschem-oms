// ============================================================================
// VOLKSCHEM OMS — Consistent JSON Response Helpers
// ============================================================================

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} statusCode
 */
function sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    errors: null,
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {Array|null} errors
 */
function sendError(res, message = 'Something went wrong', statusCode = 500, errors = null) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors,
  });
}

/**
 * Send a validation error response (422).
 */
function sendValidationError(res, errors = []) {
  return res.status(422).json({
    success: false,
    data: null,
    message: 'Validation failed',
    errors,
  });
}

module.exports = { sendSuccess, sendError, sendValidationError };
