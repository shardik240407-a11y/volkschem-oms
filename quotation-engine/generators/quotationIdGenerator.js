// ============================================================================
// VOLKSCHEM OMS — Quotation ID Generator
// ============================================================================
// Generates formatted quotation IDs: VCS-YYYY-NNNN
// Pure logic — the backend service provides the last sequence number from DB.
// ============================================================================

/**
 * Generate the next quotation ID.
 *
 * @param {number} currentYear          — e.g. 2025, 2026
 * @param {number} lastSequenceNumber   — last used sequence (0 if first of the year)
 * @returns {string} formatted quotation ID
 *
 * @example
 * generateQuotationId(2025, 0)   // => 'VCS-2025-0001'
 * generateQuotationId(2025, 41)  // => 'VCS-2025-0042'
 * generateQuotationId(2025, 99)  // => 'VCS-2025-0100'
 */
function generateQuotationId(currentYear, lastSequenceNumber) {
  if (!currentYear || currentYear < 2000) {
    throw new Error('currentYear must be a valid year (>= 2000).');
  }
  if (lastSequenceNumber == null || lastSequenceNumber < 0) {
    throw new Error('lastSequenceNumber must be a non-negative integer.');
  }

  const nextSequence = lastSequenceNumber + 1;
  const paddedSequence = String(nextSequence).padStart(4, '0');

  return `VCS-${currentYear}-${paddedSequence}`;
}

module.exports = { generateQuotationId };
