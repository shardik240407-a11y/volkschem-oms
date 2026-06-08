// ============================================================================
// VOLKSCHEM OMS — GST Calculator
// ============================================================================
// Calculates GST amount and total with GST for a row.
// Pure calculation — no database calls.
// ============================================================================

/**
 * Calculate GST amount and row total including GST.
 *
 * @param {Object} input
 * @param {number} input.rowAmount — pre-tax row amount
 * @param {number} input.gstRate   — GST rate as percentage (5 or 18)
 * @returns {{ gstAmount: number, rowTotalWithGst: number }}
 *
 * @example
 * calculateGST({ rowAmount: 107000, gstRate: 18 })
 * // => { gstAmount: 19260.00, rowTotalWithGst: 126260.00 }
 */
function calculateGST({ rowAmount, gstRate }) {
  if (rowAmount == null || rowAmount < 0) {
    throw new Error('rowAmount must be a non-negative number.');
  }
  if (gstRate == null || gstRate < 0) {
    throw new Error('gstRate must be a non-negative number.');
  }

  const gstAmount = (rowAmount * gstRate) / 100;
  const rowTotalWithGst = rowAmount + gstAmount;

  return {
    gstAmount: Math.round(gstAmount * 100) / 100,
    rowTotalWithGst: Math.round(rowTotalWithGst * 100) / 100,
  };
}

/**
 * Get the default GST rate for a product category.
 * Agricultural and granule products get 5% GST; all others get 18%.
 *
 * @param {string} productCategory
 * @returns {number} 5 or 18
 */
function getDefaultGstRate(productCategory) {
  if (!productCategory) return 18;

  const category = productCategory.toLowerCase().trim();
  const reducedGstCategories = [
    'granules',
    'granule',
    'agricultural',
    'agri',
    'fertilizer',
    'fertilizers',
    'bio',
    'bio-fertilizer',
    'pgr',
  ];

  if (reducedGstCategories.includes(category)) {
    return 5;
  }

  return 18;
}

module.exports = { calculateGST, getDefaultGstRate };
