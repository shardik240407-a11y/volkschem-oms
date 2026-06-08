// ============================================================================
// VOLKSCHEM OMS — Excel Service Orchestrator
// ============================================================================

const { generateInternalExcel } = require('./templates/internalQuotationTemplate');

/**
 * Orchestrator: Generate Excel
 *
 * @param {Object} quotationData
 * @returns {Promise<Buffer>}
 */
async function generateExcel(quotationData) {
  return await generateInternalExcel(quotationData);
}

module.exports = { generateExcel };
