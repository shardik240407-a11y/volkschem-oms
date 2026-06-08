// ============================================================================
// VOLKSCHEM OMS — PDF Label Inventory Section
// ============================================================================

const { formatCurrency } = require('./productTableSection'); // Reusing currency formatter if exported.
// Let's implement local formatCurrency to be safe
function formatLocalCurrency(amount) {
  if (amount == null || isNaN(amount)) return '-';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Generate the Label Inventory Details block.
 * Rendered only when a label component is checked.
 *
 * @param {PDFDocument} doc
 * @param {Object} labelData - Aggregated label section info
 * @param {number} startY
 */
function generateLabelInventorySection(doc, labelData, startY, isFactoryView = false) {
  if (!labelData) return startY; // skip if no data

  const margin = 20;
  const pageWidth = doc.page.width - (margin * 2);
  let currentY = startY + 20; // Some spacing

  // Section Title
  doc
    .font('NotoSans-Bold')
    .fontSize(10)
    .fillColor('#333333')
    .text('Packing Materials Stock Inventory Payment', margin, currentY);

  currentY += 15;

  // Table Columns Setup
  const columns = [
    { label: 'Brand Name', key: 'brand_name', width: 80 },
    { label: 'Pack Type', key: 'pack_type', width: 60 },
    { label: 'Pack Size', key: 'pack_size', width: 50 },
    { label: 'Open Stock', key: 'open_stock', width: 60 },
    { label: 'Make', key: 'make', width: 50 },
    { label: 'Total Stock', key: 'total_stock', width: 60 },
    { label: 'Used', key: 'used', width: 50 },
    { label: 'Closing Stock', key: 'closing_stock', width: 70 },
  ];

  if (!isFactoryView) {
    columns.push(
      { label: 'Rate', key: 'rate', width: 50 },
      { label: 'Amount', key: 'amount', width: 70 },
      { label: 'GST', key: 'gst', width: 50 },
      { label: 'Total with GST', key: 'total_with_gst', width: 80 }
    );
  }

  // Adjust widths proportionally
  const totalDesiredWidth = columns.reduce((sum, col) => sum + col.width, 0);
  if (totalDesiredWidth !== pageWidth) {
    const scale = pageWidth / totalDesiredWidth;
    columns.forEach(col => col.width = col.width * scale);
  }

  // Header Background (Light Yellow)
  const headerHeight = 25;
  doc.rect(margin, currentY, pageWidth, headerHeight).fill('#FFF9C4'); // Light yellow
  
  // Header Text
  doc.fillColor('#333333').font('NotoSans-Bold').fontSize(7);
  let currentX = margin;
  columns.forEach(col => {
    doc.text(col.label, currentX + 2, currentY + 7, {
      width: col.width - 4,
      align: 'center',
    });
    currentX += col.width;
  });

  currentY += headerHeight;

  // Draw Data Row
  const rowHeight = 20;
  doc.rect(margin, currentY, pageWidth, rowHeight).stroke('#CCCCCC'); // Bordered row
  doc.font('NotoSans').fontSize(7);
  currentX = margin;

  columns.forEach(col => {
    let value = labelData[col.key] != null ? labelData[col.key] : '-';
    
    // Formatting financials
    if (['rate', 'amount', 'gst', 'total_with_gst'].includes(col.key)) {
      value = formatLocalCurrency(labelData[col.key]);
    }

    doc.text(value.toString(), currentX + 2, currentY + 6, {
      width: col.width - 4,
      align: 'center',
    });
    currentX += col.width;
  });

  // Outline the whole table
  doc.rect(margin, currentY - headerHeight, pageWidth, headerHeight + rowHeight).stroke('#CCCCCC');

  return currentY + rowHeight + 10;
}

module.exports = { generateLabelInventorySection };
