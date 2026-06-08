// ============================================================================
// VOLKSCHEM OMS — Quotation Total Calculator
// ============================================================================
// Aggregates all row totals into quotation-level subtotal, GST, and grand total.
// Pure calculation — no database calls.
// ============================================================================

/**
 * Calculate quotation-level totals by summing all rows.
 *
 * @param {Array<Object>} rows
 * @param {number} rows[].rowAmount        — pre-tax amount for the row
 * @param {number} rows[].gstAmount        — GST amount for the row
 * @param {number} rows[].rowTotalWithGst  — total including GST for the row
 * @returns {{ subtotal: number, totalGst: number, grandTotal: number }}
 *
 * @example
 * calculateQuotationTotal([
 *   { rowAmount: 107000, gstAmount: 19260, rowTotalWithGst: 126260 },
 *   { rowAmount: 50000,  gstAmount: 9000,  rowTotalWithGst: 59000  },
 * ])
 * // => { subtotal: 157000.00, totalGst: 28260.00, grandTotal: 185260.00 }
 */
function calculateQuotationTotal(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('rows must be a non-empty array.');
  }

  let subtotal = 0;
  let totalGst = 0;
  let grandTotal = 0;

  for (const row of rows) {
    subtotal += parseFloat(row.rowAmount) || 0;
    totalGst += parseFloat(row.gstAmount) || 0;
    grandTotal += parseFloat(row.rowTotalWithGst) || 0;
  }

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

module.exports = { calculateQuotationTotal };
