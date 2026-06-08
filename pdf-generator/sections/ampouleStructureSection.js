const { AMPOULE_PACKAGING } = require('../constants');

function generateAmpouleStructureSection(doc, quotationData, startY) {
  // Check if any row uses Ampoule
  const hasAmpoule = quotationData.rows.some(r => r.packing_type === 'Ampoule');
  if (!hasAmpoule) return startY;
  // Only show if there's an ampoule row
  const ampouleRows = quotationData.rows.filter(r => r.packing_type && r.packing_type.toLowerCase().includes('ampoule'));
  if (ampouleRows.length === 0) return startY;

  const margin = 40;
  let currentY = startY;

  if (currentY > doc.page.height - 120) {
    doc.addPage();
    currentY = margin;
  }

  doc.rect(margin, currentY, 500, 15).fill('#1B5E20');
  doc.fillColor('#FFFFFF').font('NotoSans-Bold').fontSize(8);
  
  const cols = [
    { label: 'INNER BOX FOR AMPOULES', x: margin, w: 200 },
    { label: 'OUTER BOX', x: margin + 200, w: 100 },
    { label: 'FBB BOX', x: margin + 300, w: 100 },
    { label: 'TRAY', x: margin + 400, w: 100 }
  ];

  cols.forEach(c => doc.text(c.label, c.x + 2, currentY + 4, { width: c.w - 4, align: 'center' }));
  currentY += 15;

  doc.font('NotoSans-Bold').fontSize(7);

  // Group by unique pack sizes
  const sizes = [...new Set(ampouleRows.map(r => `${r.pack_size_value}${r.pack_size_unit.toLowerCase()}`))];

  sizes.forEach((size, i) => {
    const isEven = i % 2 === 0;
    doc.rect(margin, currentY, 500, 15).fill(isEven ? '#F9F9F9' : '#FFFFFF');
    doc.fillColor('#333333');

    const spec = AMPOULE_PACKAGING[size];
    if (spec) {
      const pSize = size.toUpperCase();
      const innersInOuter = spec.outerBoxPcs / spec.innerBoxPcs;
      const innerText = `${pSize} x ${spec.innerBoxPcs} NOS= 1 INNER x ${innersInOuter} INNER=1 BOX`;
      const outerText = `${spec.outerBoxPcs} NOS`;
      const fbbText = `${pSize} x ${spec.fbbBoxPcs} NOS`;
      const trayText = `${pSize} x ${spec.trayPcs} NOS`;

      doc.text(innerText, cols[0].x + 2, currentY + 4, { width: cols[0].w - 4, align: 'center' });
      doc.text(outerText, cols[1].x + 2, currentY + 4, { width: cols[1].w - 4, align: 'center' });
      doc.text(fbbText,   cols[2].x + 2, currentY + 4, { width: cols[2].w - 4, align: 'center' });
      doc.text(trayText,  cols[3].x + 2, currentY + 4, { width: cols[3].w - 4, align: 'center' });
    }

    currentY += 15;
  });

  // Notes
  currentY += 5;
  doc.font('NotoSans-Bold').fontSize(8).fillColor('#333333');
  doc.text('NOTE: FBB BOX PLAIN WHITE (WITHOUT PRINT)', margin, currentY);
  currentY += 12;
  doc.text('NOTE: MOQ (Minimum Order Quantity) EACH PACK SIZE 1000 NOS', margin, currentY);

  return currentY + 20;
}

module.exports = { generateAmpouleStructureSection };
