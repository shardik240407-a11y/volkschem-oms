// ============================================================================
// VOLKSCHEM OMS — Component Cost Calculator (v2)
// ============================================================================
// Calculates cost per piece for each component with correct division logic.
// Some components are priced per unit (tray, carton, box) that holds multiple
// pieces — this calculator handles the division.
// ============================================================================

const { AMPOULE_PACKAGING } = require('../constants/ampoulePackagingStructure');

/**
 * Components that need NO division — their rate IS the cost per piece.
 */
const NO_DIVISION_COMPONENTS = new Set([
  'Bulk Material', 'Ampoule Glass', 'Label', 'Shrink Cap',
  'Bottle', 'Pouch', 'Jar/Dabba', 'Bucket', 'Drum', 'Job Work',
]);

/**
 * Get the divisor (pieces per packaging unit) for a given component.
 *
 * @param {string} componentName
 * @param {string} packingType    — 'Bottle', 'Ampoule', 'Pouch', etc.
 * @param {string} ampouleSize   — e.g. '5ml' (only relevant when packingType=Ampoule)
 * @param {number} nosPerCarton  — from employee input (only for Carton Box)
 * @returns {{ divisor: number, divisorLabel: string }}
 */
function getComponentDivisor(componentName, packingType, ampouleSize, nosPerCarton) {
  // No division needed for these components
  if (NO_DIVISION_COMPONENTS.has(componentName)) {
    return { divisor: 1, divisorLabel: '' };
  }

  // Carton Box — divide by nos per carton (Bottle, Pouch, Jar)
  if (componentName === 'Carton Box') {
    const d = parseInt(nosPerCarton) || 1;
    return { divisor: d, divisorLabel: `${d} nos per carton` };
  }

  // Ampoule packaging components
  if (packingType === 'Ampoule') {
    const spec = AMPOULE_PACKAGING[ampouleSize];
    if (!spec) {
      return { divisor: 1, divisorLabel: '' };
    }

    switch (componentName) {
      case 'Tray':
        return { divisor: spec.trayPcs, divisorLabel: `${spec.trayPcs} pcs per tray` };
      case 'FBB Box':
        return { divisor: spec.fbbBoxPcs, divisorLabel: `${spec.fbbBoxPcs} pcs per FBB Box` };
      case 'Inner Box':
        return { divisor: spec.innerBoxPcs, divisorLabel: `${spec.innerBoxPcs} pcs per inner box` };
      case 'Outer Box':
        return { divisor: spec.outerBoxPcs, divisorLabel: `${spec.outerBoxPcs} pcs per outer box` };
      default:
        return { divisor: 1, divisorLabel: '' };
    }
  }

  return { divisor: 1, divisorLabel: '' };
}

/**
 * Calculate cost per piece for a single component after applying division.
 *
 * @param {Object} params
 * @param {string} params.componentName
 * @param {number} params.appliedRate    — the rate per unit (may need division)
 * @param {string} params.packingType
 * @param {string} params.ampouleSize   — e.g. '5ml'
 * @param {number} params.nosPerCarton
 * @returns {{ costPerPcs: number, divisor: number, divisorLabel: string }}
 */
function getComponentCostPerPcs({ componentName, appliedRate, packingType, ampouleSize, nosPerCarton }) {
  const rate = parseFloat(appliedRate) || 0;
  const { divisor, divisorLabel } = getComponentDivisor(componentName, packingType, ampouleSize, nosPerCarton);
  const costPerPcs = divisor > 0 ? rate / divisor : 0;
  return {
    costPerPcs: Math.round(costPerPcs * 10000) / 10000,
    divisor,
    divisorLabel,
  };
}

/**
 * Calculate total cost per piece by summing all checked component costPerPcs
 * values (after division).
 *
 * @param {Array} components — array of { componentName, isChecked, appliedRate, isBulkMaterial, bulkCostPerPcs }
 * @param {Object} opts — { packingType, ampouleSize, nosPerCarton }
 * @returns {number} totalCostPerPcs rounded to 4 decimal places
 */
function calculateComponentCost(components, opts = {}) {
  if (!Array.isArray(components)) {
    throw new Error('components must be an array.');
  }

  const { packingType, ampouleSize, nosPerCarton } = opts;

  let totalCostPerPcs = 0;

  for (const c of components) {
    if (!c.isChecked) continue;

    if (c.isBulkMaterial || c.componentName === 'Bulk Material') {
      // Bulk material uses pre-calculated cost per piece
      totalCostPerPcs += parseFloat(c.bulkCostPerPcs || c.appliedRate) || 0;
    } else {
      const { costPerPcs } = getComponentCostPerPcs({
        componentName: c.componentName,
        appliedRate: c.appliedRate,
        packingType,
        ampouleSize,
        nosPerCarton,
      });
      totalCostPerPcs += costPerPcs;
    }
  }

  return Math.round(totalCostPerPcs * 10000) / 10000;
}

module.exports = { calculateComponentCost, getComponentCostPerPcs, getComponentDivisor };
