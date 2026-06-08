// ============================================================================
// VOLKSCHEM OMS — Quotation Validator
// ============================================================================
// Validates a complete quotation object before saving.
// Pure validation — no database calls.
// ============================================================================

/**
 * Validate a complete quotation object.
 *
 * @param {Object} quotation
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateQuotation(quotation) {
  const errors = [];

  if (!quotation) {
    return { isValid: false, errors: ['Quotation object is required.'] };
  }

  // ── Required fields ─────────────────────────────────────────────────────
  if (!quotation.customer_name || quotation.customer_name.trim() === '') {
    errors.push('Customer name is required.');
  }

  if (!quotation.quotation_date) {
    errors.push('Quotation date is required.');
  }

  // ── Order type ──────────────────────────────────────────────────────────
  if (!quotation.order_type || !['product', 'bulk'].includes(quotation.order_type)) {
    errors.push('Order type must be "product" or "bulk".');
  }

  // ── Product quotation requires product_order_type ───────────────────────
  if (quotation.order_type === 'product') {
    if (!quotation.product_order_type ||
        !['gujarat_brand', 'third_party'].includes(quotation.product_order_type)) {
      errors.push('Product order type must be "gujarat_brand" or "third_party" for product quotations.');
    }
  }

  // ── Rows ────────────────────────────────────────────────────────────────
  if (!quotation.rows || !Array.isArray(quotation.rows) || quotation.rows.length === 0) {
    errors.push('At least one quotation row is required.');
  } else {
    quotation.rows.forEach((row, idx) => {
      const rowNum = idx + 1;

      if (quotation.order_type === 'product' && !row.product_id) {
        errors.push(`Row ${rowNum}: product ID is required.`);
      }

      if (!row.packing_type) {
        errors.push(`Row ${rowNum}: packing type is required.`);
      }
      if (!row.pack_size_value || row.pack_size_value <= 0) {
        errors.push(`Row ${rowNum}: pack size value must be a positive number.`);
      }
      if (!row.pack_size_unit) {
        errors.push(`Row ${rowNum}: pack size unit is required.`);
      }
      if (!row.total_quantity_ltr_kg || row.total_quantity_ltr_kg <= 0) {
        errors.push(`Row ${rowNum}: total quantity must be a positive number.`);
      }
      if (!row.total_pcs || row.total_pcs <= 0) {
        errors.push(`Row ${rowNum}: total pieces must be a positive number.`);
      }
      if (row.gst_rate == null || row.gst_rate < 0) {
        errors.push(`Row ${rowNum}: GST rate is required.`);
      }
      if (row.cost_per_pcs == null || row.cost_per_pcs < 0) {
        errors.push(`Row ${rowNum}: cost per piece must be a non-negative number.`);
      }
      if (row.row_amount == null || row.row_amount < 0) {
        errors.push(`Row ${rowNum}: row amount must be a non-negative number.`);
      }
    });
  }

  // ── Totals sanity check ─────────────────────────────────────────────────
  if (quotation.grand_total != null && quotation.grand_total < 0) {
    errors.push('Grand total cannot be negative.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = { validateQuotation };
