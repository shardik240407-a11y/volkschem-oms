// ============================================================================
// VOLKSCHEM OMS — Label Inventory Manager
// ============================================================================
// Core orchestrator for label stock checks, calculations, and deductions.
// Pure logic — no database calls.
// ============================================================================

/**
 * Check if sufficient label stock exists for an order.
 *
 * @param {Object} params
 * @param {string} params.productId         — product UUID
 * @param {string} params.packType          — e.g. 'bottle', 'pouch'
 * @param {string} params.packSize          — e.g. '500ml', '1ltr'
 * @param {number} params.requiredQuantity  — pieces needed for the order
 * @param {Object} params.currentInventory  — { closing_stock, ... } from DB
 * @returns {{
 *   isSufficient: boolean,
 *   currentStock: number,
 *   requiredQuantity: number,
 *   shortfallQuantity: number,
 *   projectedClosingStock: number
 * }}
 */
function checkLabelStock({ productId, packType, packSize, requiredQuantity, currentInventory }) {
  const currentStock = (currentInventory && currentInventory.closing_stock) || 0;
  const isSufficient = currentStock >= requiredQuantity;
  const shortfallQuantity = isSufficient ? 0 : requiredQuantity - currentStock;
  const projectedClosingStock = currentStock - requiredQuantity;

  return {
    isSufficient,
    currentStock,
    requiredQuantity,
    shortfallQuantity,
    projectedClosingStock,
  };
}

/**
 * Calculate the full label section for a quotation row.
 * This produces the label cost breakdown shown on factory PDFs.
 *
 * @param {Object} params
 * @param {Object} params.currentInventory — { open_stock, closing_stock, ... }
 * @param {number} params.newBatchQuantity — labels being printed (0 if no new batch)
 * @param {number} params.orderQuantity    — labels being used for this order
 * @param {number} params.labelRate        — cost per label
 * @returns {{
 *   openStock: number,
 *   make: number,
 *   totalStock: number,
 *   used: number,
 *   closingStock: number,
 *   rate: number,
 *   amount: number,
 *   gst: number,
 *   totalWithGst: number
 * }}
 */
function calculateLabelSection({ currentInventory, newBatchQuantity, orderQuantity, labelRate }) {
  const openStock = (currentInventory && currentInventory.closing_stock) || 0;
  const make = newBatchQuantity || 0;
  const totalStock = openStock + make;
  const used = orderQuantity || 0;
  const closingStock = totalStock - used;

  const rate = labelRate || 0;
  const amount = used * rate;
  const gst = Math.round(amount * 0.18 * 100) / 100;
  const totalWithGst = Math.round((amount + gst) * 100) / 100;

  return {
    openStock,
    make,
    totalStock,
    used,
    closingStock,
    rate,
    amount: Math.round(amount * 100) / 100,
    gst,
    totalWithGst,
  };
}

/**
 * Deduct label stock after an order is confirmed.
 * Returns an updated inventory object (the caller writes to DB).
 *
 * @param {Object} currentInventory — full inventory row from DB
 * @param {number} deductQuantity   — number of labels used
 * @returns {Object} updated inventory fields
 */
function deductLabelStock(currentInventory, deductQuantity) {
  if (!currentInventory) {
    throw new Error('currentInventory is required.');
  }
  if (deductQuantity == null || deductQuantity < 0) {
    throw new Error('deductQuantity must be a non-negative number.');
  }

  const currentClosing = currentInventory.closing_stock || 0;
  const currentUsed = currentInventory.used_to_date || 0;

  if (deductQuantity > currentClosing) {
    throw new Error(
      `Insufficient stock. Available: ${currentClosing}, requested: ${deductQuantity}.`
    );
  }

  return {
    ...currentInventory,
    closing_stock: currentClosing - deductQuantity,
    used_to_date: currentUsed + deductQuantity,
    last_updated: new Date().toISOString(),
  };
}

module.exports = {
  checkLabelStock,
  calculateLabelSection,
  deductLabelStock,
};
