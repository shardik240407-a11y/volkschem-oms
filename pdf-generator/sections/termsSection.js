const path = require('path');

function generateTermsSection(doc, startY) {
  const margin = 30;
  const currentY = startY + 40;

  // ── Left Side: Terms & Conditions ───────────────────────────────────────
  
  doc
    .font('NotoSans-Bold')
    .fontSize(10)
    .fillColor('#1B5E20')
    .text('Terms & Conditions:', margin, currentY);

  const terms = [
    '1. Prices are inclusive of packing material.',
    '2. GST will be charged as applicable.',
    '3. Payment Terms: 100% advance with order.',
    '4. Delivery: Within 7-10 working days from the date of order.',
    '5. Freight: Included up to destination.',
    '6. Quotation valid till the date mentioned above.',
    '7. Subject to local jurisdiction only.',
    '8. Company reserves the right to change the prices without prior notice.'
  ];

  doc.font('NotoSans').fontSize(8).fillColor('#333333');
  terms.forEach((term, idx) => {
    doc.text(term, margin, currentY + 20 + (idx * 12));
  });

  // ── Right Side: Signature Block ─────────────────────────────────────────
  
  const rightX = doc.page.width - 250;
  // Move signature down safely below the totals box (which can be up to 130px tall)
  const sigY = startY + 140;
  
  doc.font('NotoSans-Bold').fontSize(10);
  doc.text('For Volkschem Crop Science (P) Limited', rightX, sigY, { width: 200, align: 'center' });
  
  // Try to load a signature image if it exists, otherwise just leave space
  try {
    const sigPath = path.resolve(__dirname, '../../assets/signature.png');
    doc.image(sigPath, rightX + 50, sigY + 20, { height: 40 });
  } catch (err) {
    // No signature image, just draw a line
    doc.moveTo(rightX + 20, sigY + 70).lineTo(rightX + 180, sigY + 70).lineWidth(0.5).strokeColor('#333333').stroke();
  }
  
  doc.font('NotoSans-Bold').fontSize(9);
  doc.text('Authorized Signatory', rightX, sigY + 80, { width: 200, align: 'center' });
  
  return sigY + 120;
}

module.exports = { generateTermsSection };
