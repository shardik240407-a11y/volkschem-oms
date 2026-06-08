// ============================================================================
// VOLKSCHEM OMS — PDF Header Section
// ============================================================================

const path = require('path');
const { formatIndianDate } = require('../utils/dateFormatter');

/**
 * Generate the top header section of the PDF.
 *
 * @param {PDFDocument} doc
 * @param {Object} quotationData
 */
function generateHeader(doc, quotationData) {
  const margin = 30;
  const rightMargin = doc.page.width - 30;
  let currentY = 30;

  // ── Top Header: Logo + Company + Address ──────────────────────────────────
  
  // Left side: Logo
  const logoPath = path.resolve(__dirname, '../../assets/logo/fix-site-logo.png');
  try {
    doc.image(logoPath, margin, currentY - 10, { height: 60 });
  } catch (err) {
    // If logo not found, just print placeholder text
    doc.font('NotoSans-Bold').fontSize(16).fillColor('#D32F2F').text('VOLKSCHEM', margin, currentY);
  }

  // Right side: Address
  doc.font('NotoSans').fontSize(8).fillColor('#333333');
  const addressLines = [
    'Corporate Office: 806-808 C Block 8th Floor',
    'Signature-2 Business Park, Sanand Cross Road',
    'Off SG Highway, Ahmedabad 382210 Gujarat',
    'GST: 24AAFCV2675N1ZU | CIN: U24100GJ2015PTC084879',
    'www.volkschem.com | +91 98250 12345'
  ];
  
  addressLines.forEach((line, i) => {
    // We want to align this to the right properly without wrapping
    doc.text(line, rightMargin - 250, currentY + 5 + (i * 12), { width: 250, align: 'right' });
  });

  currentY += 65;

  // Green Divider Line
  doc.moveTo(margin, currentY)
     .lineTo(rightMargin, currentY)
     .lineWidth(1.5)
     .strokeColor('#1B5E20')
     .stroke();
     
  currentY += 20;

  // ── Center: QUOTATION ───────────────────────────────────────────────────
  
  doc.font('NotoSans-Bold').fontSize(18).fillColor('#333333');
  doc.text('QUOTATION', 0, currentY, { align: 'center', width: doc.page.width });
  
  currentY += 30;

  // ── Center-ish: Quote Details ───────────────────────────────────────────
  
  const detailX = doc.page.width / 2 - 60;
  
  doc.font('NotoSans').fontSize(9).fillColor('#333333');
  doc.text('Quote No     :', detailX, currentY);
  doc.text(quotationData.quotation_number || 'N/A', detailX + 70, currentY);
  
  doc.text('Date             :', detailX, currentY + 15);
  doc.text(formatIndianDate(quotationData.quotation_date), detailX + 70, currentY + 15);

  currentY += 45;

  return currentY;
}

module.exports = { generateHeader };
