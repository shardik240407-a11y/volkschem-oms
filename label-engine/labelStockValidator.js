// ============================================================================
// VOLKSCHEM OMS — Label Stock Validator
// ============================================================================
// Validates label batch sizes and stock sufficiency.
// Pure validation — no database calls.
// ============================================================================

const MINIMUM_BATCH_QUANTITY = 1000;

/**
 * Validate that a label batch meets the minimum order quantity.
 *
 * @param {number} batchQuantity
 * @returns {{ isValid: boolean, error: string|null }}
 */
function validateMinimumBatch(batchQuantity) {
  if (batchQuantity == null || batchQuantity < MINIMUM_BATCH_QUANTITY) {
    return {
      isValid: false,
      error: `Minimum order quantity for labels is ${MINIMUM_BATCH_QUANTITY} pieces. Received: ${batchQuantity || 0}.`,
    };
  }

  return { isValid: true, error: null };
}

/**
 * Validate that sufficient stock exists for a requirement.
 *
 * @param {number} availableStock — current closing stock
 * @param {number} requiredStock  — stock needed for the order
 * @returns {{ isValid: boolean, deficit: number, message: string }}
 */
function validateSufficientStock(availableStock, requiredStock) {
  const available = availableStock || 0;
  const required = requiredStock || 0;

  if (available >= required) {
    return {
      isValid: true,
      deficit: 0,
      message: `Sufficient stock available. Current: ${available}, required: ${required}.`,
    };
  }

  const deficit = required - available;
  return {
    isValid: false,
    deficit,
    message: `Insufficient label stock. Available: ${available}, required: ${required}, shortfall: ${deficit}.`,
  };
}

module.exports = {
  MINIMUM_BATCH_QUANTITY,
  validateMinimumBatch,
  validateSufficientStock,
};
