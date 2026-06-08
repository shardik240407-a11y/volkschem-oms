function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

function generateTotalsSection(doc, quotationData, startY) {
  const margin = 30;
  const pageWidth = doc.page.width - (margin * 2);
  let currentY = startY;

  // ── Totals Box (Right Aligned) ───────────────────────────────────
  // We want to align this roughly with the end of the table
  const boxWidth = 200;
  const boxX = margin + pageWidth - boxWidth;
  const rowHeight = 25;

  // Function to draw a row
  const drawRow = (label, value, isGrandTotal = false, isCurrency = true) => {
    // Background and border
    if (isGrandTotal) {
      doc.rect(boxX, currentY, boxWidth, rowHeight).fillAndStroke('#1B5E20', '#CCCCCC');
      doc.fillColor('#FFFFFF');
    } else {
      doc.rect(boxX, currentY, boxWidth, rowHeight).fillAndStroke('#FFFFFF', '#CCCCCC');
      doc.fillColor('#333333');
    }

    doc.font(isGrandTotal ? 'NotoSans-Bold' : 'NotoSans').fontSize(10);
    
    // Label on left
    doc.text(label, boxX + 10, currentY + 7);
    
    // Value on right
    const displayValue = isCurrency ? formatCurrency(value) : new Intl.NumberFormat('en-IN').format(value);
    doc.text(displayValue, boxX + 10, currentY + 7, { width: boxWidth - 20, align: 'right' });
    
    currentY += rowHeight;
  };

  let totalQty = 0;
  let qtyLabel = 'Total Qty';
  if (quotationData.order_type === 'bulk') {
    totalQty = quotationData.quantity || 0;
    qtyLabel = `Total Qty (${quotationData.material_unit === 'kg' ? 'Kg' : 'Ltr'})`;
  } else {
    totalQty = quotationData.rows?.reduce((sum, r) => sum + (r.total_pcs || 0), 0) || 0;
    qtyLabel = 'Total Qty (Pcs)';
  }

  drawRow(qtyLabel, totalQty, false, false);
  drawRow('Subtotal', quotationData.subtotal);
  
  // Calculate CGST and SGST (assuming total_gst is 18%, so 9% each)
  const halfGst = (quotationData.total_gst || 0) / 2;
  drawRow('CGST 9%', halfGst);
  drawRow('SGST 9%', halfGst);
  
  drawRow('Grand Total', quotationData.grand_total, true);

  return currentY;
}

module.exports = { generateTotalsSection };
