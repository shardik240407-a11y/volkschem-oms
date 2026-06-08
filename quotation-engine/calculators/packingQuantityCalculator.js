// ============================================================================
// VOLKSCHEM OMS — Packing Quantity Calculator
// ============================================================================
// Calculates total number of pieces from order quantity and pack size.
// Pure calculation — no database calls.
// ============================================================================

/**
 * Calculate total pieces from total order quantity and pack size.
 * Always rounds UP (Math.ceil) — never produce fewer pieces than needed.
 *
 * @param {Object} input
 * @param {number} input.totalQuantityLtrKg — total order in litres or kg
 * @param {number} input.packSizeValue      — numeric pack size (e.g. 500)
 * @param {string} input.packSizeUnit       — 'ml' | 'ltr' | 'gm' | 'kg'
 * @returns {number} totalPcs (integer, rounded up)
 *
 * @example
 * calculateTotalPcs({ totalQuantityLtrKg: 200, packSizeValue: 500, packSizeUnit: 'ml' })
 * // => 400  (200 ltr ÷ 0.5 ltr/pc)
 */
function calculateTotalPcs({ totalQuantityLtrKg, packSizeValue, packSizeUnit }) {
  if (totalQuantityLtrKg == null || totalQuantityLtrKg <= 0) {
    throw new Error('totalQuantityLtrKg must be a positive number.');
  }
  if (packSizeValue == null || packSizeValue <= 0) {
    throw new Error('packSizeValue must be a positive number.');
  }
  if (!packSizeUnit) {
    throw new Error('packSizeUnit is required.');
  }

  const unit = packSizeUnit.toLowerCase().trim();
  let packSizeInBaseUnit; // litres or kg

  switch (unit) {
    case 'ml':
      packSizeInBaseUnit = packSizeValue / 1000;
      break;
    case 'ltr':
    case 'l':
    case 'litre':
    case 'litres':
      packSizeInBaseUnit = packSizeValue;
      break;
    case 'gm':
    case 'g':
    case 'gram':
    case 'grams':
      packSizeInBaseUnit = packSizeValue / 1000;
      break;
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      packSizeInBaseUnit = packSizeValue;
      break;
    default:
      throw new Error(`Unknown pack size unit: "${packSizeUnit}". Expected ml, ltr, gm, or kg.`);
  }

  const totalPcs = Math.ceil(totalQuantityLtrKg / packSizeInBaseUnit);

  return totalPcs;
}

module.exports = { calculateTotalPcs };
