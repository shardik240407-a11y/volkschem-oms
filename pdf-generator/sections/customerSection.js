// ============================================================================
// VOLKSCHEM OMS — PDF Customer Details Section
// ============================================================================

/**
 * Generate the customer details block with a bordered box.
 *
 * @param {PDFDocument} doc
 * @param {Object} data
 * @param {number} startY
 * @param {string} title - Optional title (e.g. 'PRODUCTION ORDER')
 */
function generateCustomerSection(doc, data, startY, title = null) {
  const margin = 30;
  let currentY = startY;

  // Optional Title (used for Factory Order)
  if (title) {
    doc
      .font('NotoSans-Bold')
      .fontSize(14)
      .fillColor('#1B5E20')
      .text(title, margin, currentY, { align: 'center', width: doc.page.width - (margin * 2) });
    currentY += 25;
  }

  doc.font('NotoSans-Bold').fontSize(10).fillColor('#1B5E20');
  doc.text('Bill To:', margin, currentY);
  currentY += 15;

  doc.font('NotoSans-Bold').fontSize(10).fillColor('#333333');
  doc.text(data.billing_name || data.customer_name || 'N/A', margin, currentY);
  currentY += 15;

  doc.font('NotoSans').fontSize(9).fillColor('#333333');

  if (data.billing_address) {
    doc.text(data.billing_address, margin, currentY, { width: 300 });
    // Quick heuristic to guess lines based on text length
    const lines = Math.ceil(data.billing_address.length / 50);
    currentY += 12 * lines;
  }

  currentY += 5;
  doc.text(`GSTIN: ${data.gst_pan || 'N/A'}`, margin, currentY);
  currentY += 12;

  return currentY + 20;
}

module.exports = { generateCustomerSection };
