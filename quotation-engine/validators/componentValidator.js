// ============================================================================
// VOLKSCHEM OMS — Component Validator
// ============================================================================
// Validates component array for a single quotation row.
// Ensures component combinations are valid for the packing type.
// Pure validation — no database calls.
// ============================================================================

// ── Forbidden component mappings per packing type ───────────────────────────

const FORBIDDEN_COMPONENTS = {
  bottle: [
    'ampoule glass', 'ampoule', 'tray', 'fbb box', 'fbb_box', 'inner box', 'inner_box',
  ],
  ampoule: [
    'bottle', 'shrink cap', 'shrink_cap', 'carton box', 'carton_box', 'carton',
  ],
  pouch: [
    'bottle', 'ampoule', 'ampoule glass', 'shrink cap', 'shrink_cap',
    'tray', 'fbb box', 'fbb_box', 'inner box', 'inner_box',
  ],
  jar: [
    'bottle', 'ampoule', 'ampoule glass', 'shrink cap', 'shrink_cap',
    'tray', 'fbb box', 'fbb_box', 'inner box', 'inner_box',
  ],
  dabba: [
    'bottle', 'ampoule', 'ampoule glass', 'shrink cap', 'shrink_cap',
    'tray', 'fbb box', 'fbb_box', 'inner box', 'inner_box',
  ],
  bucket: [
    'box', 'carton', 'carton box', 'carton_box', 'fbb box', 'fbb_box',
    'inner box', 'inner_box', 'label', 'cap', 'shrink cap', 'shrink_cap', 'tray',
  ],
  drum: [
    'box', 'carton', 'carton box', 'carton_box', 'fbb box', 'fbb_box',
    'inner box', 'inner_box', 'label', 'cap', 'shrink cap', 'shrink_cap', 'tray',
  ],
};

/**
 * Normalize a component name for comparison.
 * @param {string} name
 * @returns {string}
 */
function normalize(name) {
  return (name || '').toLowerCase().trim().replace(/[-_\s]+/g, ' ');
}

/**
 * Validate component array for a single quotation row.
 *
 * @param {Array<Object>} components
 * @param {string} packingType — e.g. 'bottle', 'ampoule', 'pouch', 'jar', 'bucket', 'drum'
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateComponents(components, packingType) {
  const errors = [];

  if (!Array.isArray(components)) {
    return { isValid: false, errors: ['Components must be an array.'] };
  }

  // ── 1. Bulk material component must exist and be checked ──────────────
  const bulkComponent = components.find(
    (c) => c.isBulkMaterial === true || normalize(c.componentName).includes('bulk material')
  );

  if (!bulkComponent) {
    errors.push('Bulk material component is required.');
  } else if (!bulkComponent.isChecked) {
    errors.push('Bulk material component must be checked.');
  }

  // ── 2. At least one non-bulk component must be checked ────────────────
  const nonBulkChecked = components.filter(
    (c) =>
      c.isChecked &&
      c.isBulkMaterial !== true &&
      !normalize(c.componentName).includes('bulk material')
  );
  const customComponents = components.filter((c) => c.isCustom === true);

  if (nonBulkChecked.length === 0 && customComponents.length === 0) {
    errors.push('At least one non-bulk component must be checked, or at least one custom line must exist.');
  }

  // ── 3. All applied rates must be positive numbers ─────────────────────
  components.forEach((c, idx) => {
    if (c.isChecked) {
      if (c.appliedRate == null || isNaN(c.appliedRate) || c.appliedRate < 0) {
        errors.push(`Component ${idx + 1} ("${c.componentName}"): applied rate must be a non-negative number.`);
      }
    }
  });

  // ── 4. Packing type compatibility check ───────────────────────────────
  if (packingType) {
    const packType = normalize(packingType);
    const forbidden = FORBIDDEN_COMPONENTS[packType];

    if (forbidden) {
      const checkedComponents = components.filter((c) => c.isChecked);
      for (const comp of checkedComponents) {
        const compName = normalize(comp.componentName);
        for (const forbiddenName of forbidden) {
          if (compName.includes(forbiddenName)) {
            errors.push(
              `"${comp.componentName}" is not compatible with "${packingType}" packing type.`
            );
            break;
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = { validateComponents };
