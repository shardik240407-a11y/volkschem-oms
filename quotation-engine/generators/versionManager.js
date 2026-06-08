// ============================================================================
// VOLKSCHEM OMS — Version Manager
// ============================================================================
// Manages quotation version numbering and increment rules.
// Pure logic — no database calls.
// ============================================================================

/**
 * Get the next version number.
 *
 * @param {number} currentVersion
 * @returns {number} currentVersion + 1
 */
function getNextVersion(currentVersion) {
  if (currentVersion == null || currentVersion < 0) {
    throw new Error('currentVersion must be a non-negative integer.');
  }
  return currentVersion + 1;
}

/**
 * Format version as a human-readable label.
 *
 * @param {number} version
 * @returns {string} e.g. 'v1', 'v2', 'v3'
 */
function formatVersionLabel(version) {
  if (version == null || version < 1) {
    throw new Error('version must be a positive integer.');
  }
  return `v${version}`;
}

/**
 * Determine whether the version should increment based on status transition.
 * Version increments ONLY when a quotation is edited AFTER it was submitted or rejected.
 * It does NOT increment on first creation, on simple status changes (submit, approve, reject),
 * or when editing a brand-new draft.
 *
 * @param {string} oldStatus — current status before the edit
 * @param {string} newStatus — new status after the edit
 * @returns {boolean}
 */
function shouldIncrementVersion(oldStatus, newStatus) {
  // Version increments when the quotation is being re-edited (moved back to draft)
  // after having been in a later stage.
  const editAfterSubmission =
    (oldStatus === 'pending' && newStatus === 'draft') ||
    (oldStatus === 'rejected' && newStatus === 'draft') ||
    (oldStatus === 'approved' && newStatus === 'draft');

  return editAfterSubmission;
}

module.exports = {
  getNextVersion,
  formatVersionLabel,
  shouldIncrementVersion,
};
