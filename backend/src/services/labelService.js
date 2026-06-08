// ============================================================================
// VOLKSCHEM OMS — Label Inventory Service
// ============================================================================

const supabase = require('../config/db');

/**
 * Get current label stock for a product.
 */
async function getLabelStock(productId) {
  const { data, error } = await supabase
    .from('label_inventory')
    .select('*')
    .eq('product_id', productId)
    .order('pack_type')
    .order('pack_size');

  if (error) throw error;
  return data || [];
}

/**
 * Check if sufficient labels exist for an order.
 * @param {Array} items - [{ product_id, pack_type, pack_size, quantity_needed }]
 * @returns {{ ok: boolean, results: Array }}
 */
async function checkLabelAvailability(items) {
  const results = [];
  let allOk = true;

  for (const item of items) {
    const { data: inv } = await supabase
      .from('label_inventory')
      .select('closing_stock')
      .eq('product_id', item.product_id)
      .eq('pack_type', item.pack_type)
      .eq('pack_size', item.pack_size)
      .single();

    const available = inv ? inv.closing_stock : 0;
    const sufficient = available >= item.quantity_needed;

    if (!sufficient) allOk = false;

    results.push({
      product_id: item.product_id,
      pack_type: item.pack_type,
      pack_size: item.pack_size,
      quantity_needed: item.quantity_needed,
      available,
      sufficient,
      shortfall: sufficient ? 0 : item.quantity_needed - available,
    });
  }

  return { ok: allOk, results };
}

/**
 * Add a new label batch (minimum 1000 MOQ).
 */
async function addLabelBatch({ product_id, pack_type, pack_size, quantity, batch_rate, notes }, userId) {
  if (quantity < 1000) {
    throw Object.assign(
      new Error('Minimum order quantity (MOQ) for labels is 1000.'),
      { statusCode: 400 }
    );
  }

  // Upsert inventory record
  const { data: existing } = await supabase
    .from('label_inventory')
    .select('id, open_stock, total_printed, closing_stock')
    .eq('product_id', product_id)
    .eq('pack_type', pack_type)
    .eq('pack_size', pack_size)
    .single();

  let inventoryRecord;

  if (existing) {
    // Update existing
    const newTotalPrinted = existing.total_printed + quantity;
    const newClosingStock = existing.closing_stock + quantity;

    const { data, error } = await supabase
      .from('label_inventory')
      .update({
        total_printed: newTotalPrinted,
        closing_stock: newClosingStock,
        last_updated: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) throw error;
    inventoryRecord = data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('label_inventory')
      .insert({
        product_id,
        pack_type,
        pack_size,
        open_stock: 0,
        total_printed: quantity,
        used_to_date: 0,
        closing_stock: quantity,
      })
      .select('*')
      .single();

    if (error) throw error;
    inventoryRecord = data;
  }

  // Log transaction
  const { error: txError } = await supabase
    .from('label_transactions')
    .insert({
      product_id,
      transaction_type: 'batch_added',
      quantity,
      batch_rate: batch_rate || null,
      notes: notes || null,
      created_by: userId,
    });

  if (txError) throw txError;

  return inventoryRecord;
}

/**
 * Get full transaction history for a product (audit trail).
 */
async function getTransactionHistory(productId) {
  const { data, error } = await supabase
    .from('label_transactions')
    .select(`
      id, product_id, quotation_id, order_id, transaction_type,
      quantity, batch_rate, notes, created_by, created_at
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

module.exports = {
  getLabelStock,
  checkLabelAvailability,
  addLabelBatch,
  getTransactionHistory,
};
