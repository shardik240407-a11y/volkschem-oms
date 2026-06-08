// ============================================================================
// VOLKSCHEM OMS — Quotation Engine Index
// ============================================================================
// Re-exports all calculators, generators, validators, and constants.
// ============================================================================

// Calculators
const { calculateBulkMaterialCost } = require('./calculators/bulkMaterialCalculator');
const { calculateTotalPcs } = require('./calculators/packingQuantityCalculator');
const { calculateComponentCost, getComponentCostPerPcs, getComponentDivisor } = require('./calculators/componentCostCalculator');
const { calculateRowTotal } = require('./calculators/rowTotalCalculator');
const { calculateGST, getDefaultGstRate } = require('./calculators/gstCalculator');
const { calculateQuotationTotal } = require('./calculators/quotationTotalCalculator');

// Generators
const { generateQuotationId } = require('./generators/quotationIdGenerator');
const { getNextVersion, formatVersionLabel, shouldIncrementVersion } = require('./generators/versionManager');

// Validators
const { validateQuotation } = require('./validators/quotationValidator');
const { validateComponents } = require('./validators/componentValidator');

// Constants
const { AMPOULE_PACKAGING } = require('./constants/ampoulePackagingStructure');

module.exports = {
  // Calculators
  calculateBulkMaterialCost,
  calculateTotalPcs,
  calculateComponentCost,
  getComponentCostPerPcs,
  getComponentDivisor,
  calculateRowTotal,
  calculateGST,
  getDefaultGstRate,
  calculateQuotationTotal,

  // Generators
  generateQuotationId,
  getNextVersion,
  formatVersionLabel,
  shouldIncrementVersion,

  // Validators
  validateQuotation,
  validateComponents,

  // Constants
  AMPOULE_PACKAGING,
};

