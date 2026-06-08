// ============================================================================
// VOLKSCHEM OMS — Factory Order Template
// ============================================================================

const PDFDocument = require('pdfkit');
const { generateHeader } = require('../sections/headerSection');
const { generateCustomerSection } = require('../sections/customerSection');
const { generateProductTable } = require('../sections/productTableSection');
const { generateLabelInventorySection } = require('../sections/labelInventorySection');

/**
 * Generate a Factory Production Order PDF.
 * Strips all financial information and adds Admin Notes.
 *
 * @param {Object} quotationData
 * @returns {Promise<Buffer>}
 */
function generateFactoryOrderPDF(quotationData) {
  return new Promise((resolve, reject) => {
    try {
      // Create landscape A4 document
      const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
        bufferPages: true,
      });

      const path = require('path');
      doc.registerFont('NotoSans', path.join(__dirname, '../../pdf-generator/fonts/NotoSans-Regular.ttf'));
      doc.registerFont('NotoSans-Bold', path.join(__dirname, '../../pdf-generator/fonts/NotoSans-Bold.ttf'));
      doc.font('NotoSans');

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      let currentY = 0;

      // 1. Header
      currentY = generateHeader(doc, quotationData);

      // 2. Customer Section (Title 'PRODUCTION ORDER')
      currentY = generateCustomerSection(doc, quotationData, currentY, 'PRODUCTION ORDER');

      // 3. Product Table (isFactoryView = true)
      currentY = generateProductTable(doc, quotationData, currentY, true);

      const { generateAmpouleStructureSection } = require('../sections/ampouleStructureSection');

      // 4. Admin Note (if exists)
      if (quotationData.admin_note) {
        if (currentY > doc.page.height - 100) {
          doc.addPage();
          currentY = 40;
        }

        const margin = 40;
        const boxWidth = doc.page.width - margin * 2;
        
        doc.rect(margin, currentY, boxWidth, 50).fillAndStroke('#FFF3E0', '#FF9800'); // Orange highlight
        doc.fillColor('#E65100').font('NotoSans-Bold').fontSize(10);
        doc.text('Admin Note:', margin + 10, currentY + 10);
        doc.font('NotoSans').fontSize(9).text(quotationData.admin_note, margin + 10, currentY + 25);
        
        currentY += 70;
      }

      // Append Ampoule Structure
      currentY = generateAmpouleStructureSection(doc, quotationData, currentY);

      // 5. Label Inventory (Optional - factory needs to see label counts)
      if (quotationData.label_inventory) {
        currentY = generateLabelInventorySection(doc, quotationData.label_inventory, currentY, true); // true = isFactoryView
      }

      // Add Page Numbers and Custom Footer
      const { formatIndianDate } = require('../utils/dateFormatter');
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(8)
          .font('NotoSans')
          .fillColor('#999999')
          .text(
            `Volkschem Crop Science Pvt. Ltd. | Production Order | Page ${i + 1} of ${pages.count} | Generated: ${formatIndianDate(new Date())}`,
            0,
            doc.page.height - 20,
            { align: 'center' }
          );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateFactoryOrderPDF };
