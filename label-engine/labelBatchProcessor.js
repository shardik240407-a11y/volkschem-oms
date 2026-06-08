// ============================================================================
// VOLKSCHEM OMS — Label Batch Processor
// ============================================================================
// Processes a new label batch: validates MOQ, calculates new stock totals,
// and prepares a transaction record for database insertion.
// Pure logic — no database calls.
// ============================================================================

const { validateMinimumBatch } = require('./labelStockValidator');

/**
 * Process a new label batch.
 *
 * @param {Object} params
 * @param {Object} params.currentInventory  — current inventory row from DB
 * @param {number} params.newBatchQuantity  — number of labels in the new batch
 * @param {number} params.batchRate         — cost per label for this batch
 * @returns {{
 *   updatedInventory: Object,
 *   transaction: Object
 * }}
 * @throws {Error} if batch quantity < 1000 MOQ
 */
function processBatch({ currentInventory, newBatchQuantity, batchRate }) {
  // Validate MOQ
  const validation = validateMinimumBatch(newBatchQuantity);
  if (!validation.isValid) {
    throw Object.assign(new Error(validation.error), { statusCode: 400 });
  }

  const currentTotalPrinted = (currentInventory && currentInventory.total_printed) || 0;
  const currentClosingStock = (currentInventory && currentInventory.closing_stock) || 0;

  const newTotalPrinted = currentTotalPrinted + newBatchQuantity;
  const newClosingStock = currentClosingStock + newBatchQuantity;

  // Build updated inventory object
  const updatedInventory = {
    ...(currentInventory || {}),
    total_printed: newTotalPrinted,
    closing_stock: newClosingStock,
    last_updated: new Date().toISOString(),
  };

  // Build transaction record (ready for DB insert)
  const transaction = {
    product_id: currentInventory ? currentInventory.product_id : null,
    transaction_type: 'batch_added',
    quantity: newBatchQuantity,
    batch_rate: batchRate || null,
    notes: `Batch of ${newBatchQuantity} labels added at ₹${batchRate || 0}/pc.`,
  };

  return {
    updatedInventory,
    transaction,
  };
}

module.exports = { processBatch };
