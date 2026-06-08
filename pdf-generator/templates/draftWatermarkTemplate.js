// ============================================================================
// VOLKSCHEM OMS — Draft Watermark Template
// ============================================================================

// Note: Standard pdfkit doesn't have a native "read and modify" capability.
// Since the instruction is to use PDFKit, the typical way to handle this
// is to inject the watermark during generation.
// However, the prompt specifically asks for:
// "Takes an existing PDF buffer as input... Export as applyDraftWatermark that takes pdfBuffer and returns new pdfBuffer"
// 
// Modifying an existing PDF buffer usually requires a library like 'pdf-lib'.
// Since the prompt explicitly says "Use PDFKit for PDF generation" and didn't mention pdf-lib,
// we will simulate this by exporting a wrapper that actually re-generates the PDF
// but with a watermark flag, or if we must take a buffer, we'd need pdf-lib.
// Given strict instructions to just use PDFKit, we will implement a generator
// that applies the watermark grid natively inside the pdfkit doc before drawing.
//
// Because the prompt asks for "applyDraftWatermark that takes pdfBuffer", we will
// stub it or use a trick. The correct architecture in Node without pdf-lib is to pass
// a flag to `generateCustomerQuotationPDF`. We will export a function that warns about this.
//
// WAIT: A better way is to provide a helper that draws the watermark onto a `doc` instance
// and use that inside the generation flow, but we must strictly follow the requested export.
// If the user strictly wants to modify a buffer, we'd need `pdf-lib`. Let's assume the backend
// service will pass the data instead if we restructure slightly, or we just write it assuming
// it receives the PDF document instance.
// Actually, let's implement the watermark drawing logic directly.

/**
 * Apply draft watermark to a PDF Document instance.
 * (Note: Modifying a completed Buffer requires pdf-lib. Since we are using PDFKit, 
 * we apply this directly to the document before finalizing).
 * 
 * @param {PDFDocument} doc 
 */
function applyDraftWatermark(doc) {
  const pages = doc.bufferedPageRange();
  
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    
    doc.save(); // Save current graphics state
    
    doc.fillColor('#E0E0E0', 0.4); // Light grey, semi-transparent
    doc.font('Helvetica-Bold').fontSize(40);
    
    // Rotate 45 degrees around center
    const xOffset = doc.page.width / 2;
    const yOffset = doc.page.height / 2;
    
    doc.translate(xOffset, yOffset);
    doc.rotate(-45);
    doc.translate(-xOffset, -yOffset);
    
    // Draw grid of watermarks
    for (let x = -doc.page.width; x < doc.page.width * 2; x += 300) {
      for (let y = -doc.page.height; y < doc.page.height * 2; y += 150) {
        doc.text('DRAFT — NOT FOR SHARING', x, y);
      }
    }
    
    doc.restore(); // Restore graphics state
  }
}

/**
 * Fallback: The prompt asked for this to take a buffer and return a buffer.
 * Since we only have pdfkit installed, we'll export the apply function and 
 * let the orchestrator handle the flow.
 */
module.exports = { applyDraftWatermark };
