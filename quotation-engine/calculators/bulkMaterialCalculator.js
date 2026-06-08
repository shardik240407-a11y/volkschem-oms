// ============================================================================
// VOLKSCHEM OMS — Bulk Material Cost Calculator
// ============================================================================
// Converts pack size to litres/kg then multiplies by bulk material rate.
// Pure calculation — no database calls.
// ============================================================================

/**
 * Calculate bulk material cost per piece.
 *
 * @param {Object} input
 * @param {number} input.packSizeValue  — numeric pack size (e.g. 500)
 * @param {string} input.packSizeUnit   — 'ml' | 'ltr' | 'gm' | 'kg'
 * @param {number} input.bulkRatePerLtrKg — rate per litre or per kg
 * @returns {number} bulkMaterialCostPerPcs rounded to 4 decimal places
 *
 * @example
 * calculateBulkMaterialCost({ packSizeValue: 500, packSizeUnit: 'ml', bulkRatePerLtrKg: 500 })
 * // => 250.0000  (0.5 ltr × ₹500/ltr)
 */
function calculateBulkMaterialCost({ packSizeValue, packSizeUnit, bulkRatePerLtrKg }) {
  if (packSizeValue == null || packSizeValue <= 0) {
    throw new Error('packSizeValue must be a positive number.');
  }
  if (!packSizeUnit) {
    throw new Error('packSizeUnit is required.');
  }
  if (bulkRatePerLtrKg == null || bulkRatePerLtrKg < 0) {
    throw new Error('bulkRatePerLtrKg must be a non-negative number.');
  }

  const unit = packSizeUnit.toLowerCase().trim();
  let convertedValue;

  switch (unit) {
    case 'ml':
      convertedValue = packSizeValue / 1000; // ml → litres
      break;
    case 'ltr':
    case 'l':
    case 'litre':
    case 'litres':
      convertedValue = packSizeValue; // already litres
      break;
    case 'gm':
    case 'g':
    case 'gram':
    case 'grams':
      convertedValue = packSizeValue / 1000; // gm → kg
      break;
    case 'kg':
    case 'kilogram':
    case 'kilograms':
      convertedValue = packSizeValue; // already kg
      break;
    default:
      throw new Error(`Unknown pack size unit: "${packSizeUnit}". Expected ml, ltr, gm, or kg.`);
  }

  const bulkMaterialCostPerPcs = convertedValue * bulkRatePerLtrKg;

  return Math.round(bulkMaterialCostPerPcs * 10000) / 10000;
}

module.exports = { calculateBulkMaterialCost };
