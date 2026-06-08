// ============================================================================
// VOLKSCHEM OMS — Label Engine Index
// ============================================================================
// Re-exports all label engine functions.
// ============================================================================

const {
  checkLabelStock,
  calculateLabelSection,
  deductLabelStock,
} = require('./labelInventoryManager');

const {
  MINIMUM_BATCH_QUANTITY,
  validateMinimumBatch,
  validateSufficientStock,
} = require('./labelStockValidator');

const { processBatch } = require('./labelBatchProcessor');

module.exports = {
  // Inventory Manager
  checkLabelStock,
  calculateLabelSection,
  deductLabelStock,

  // Stock Validator
  MINIMUM_BATCH_QUANTITY,
  validateMinimumBatch,
  validateSufficientStock,

  // Batch Processor
  processBatch,
};
