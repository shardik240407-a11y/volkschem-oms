// ============================================================================
// VOLKSCHEM OMS — Row Total Calculator
// ============================================================================
// Multiplies cost per piece by total pieces to get row amount.
// Pure calculation — no database calls.
// ============================================================================

/**
 * Calculate row total amount (before GST).
 *
 * @param {Object} input
 * @param {number} input.costPerPcs — cost per piece (from component calculator)
 * @param {number} input.totalPcs   — total number of pieces
 * @returns {number} rowAmount rounded to 2 decimal places
 *
 * @example
 * calculateRowTotal({ costPerPcs: 267.50, totalPcs: 400 })
 * // => 107000.00
 */
function calculateRowTotal({ costPerPcs, totalPcs }) {
  if (costPerPcs == null || costPerPcs < 0) {
    throw new Error('costPerPcs must be a non-negative number.');
  }
  if (totalPcs == null || totalPcs <= 0) {
    throw new Error('totalPcs must be a positive integer.');
  }

  const rowAmount = costPerPcs * totalPcs;

  return Math.round(rowAmount * 100) / 100;
}

module.exports = { calculateRowTotal };
