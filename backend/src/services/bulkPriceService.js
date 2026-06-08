// ============================================================================
// VOLKSCHEM OMS — Bulk Price Service
// ============================================================================

const supabase = require('../config/db');

async function getAllBulkPrices() {
  const { data, error } = await supabase
    .from('bulk_prices')
    .select('*')
    .order('material_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function searchBulkPrices(searchTerm) {
  const { data, error } = await supabase
    .from('bulk_prices')
    .select('*')
    .ilike('material_name', `%${searchTerm}%`)
    .order('material_name', { ascending: true });

  if (error) throw error;
  return data || [];
}

async function createBulkPrice({ material_name, rate_per_unit, unit }, updatedBy) {
  const { data, error } = await supabase
    .from('bulk_prices')
    .insert({
      material_name,
      rate_per_unit,
      unit,
      updated_by: updatedBy,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function updateBulkPrice(id, { rate_per_unit, material_name, unit }, updatedBy) {
  const updateData = { updated_by: updatedBy };
  if (rate_per_unit !== undefined) updateData.rate_per_unit = rate_per_unit;
  if (material_name !== undefined) updateData.material_name = material_name;
  if (unit !== undefined) updateData.unit = unit;

  const { data, error } = await supabase
    .from('bulk_prices')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  if (!data) throw Object.assign(new Error('Bulk price not found.'), { statusCode: 404 });
  return data;
}

async function deleteBulkPrice(id) {
  const { data, error } = await supabase
    .from('bulk_prices')
    .delete()
    .eq('id', id)
    .select('id, material_name')
    .single();

  if (error) throw error;
  if (!data) throw Object.assign(new Error('Bulk price not found.'), { statusCode: 404 });
  return data;
}

module.exports = {
  getAllBulkPrices,
  searchBulkPrices,
  createBulkPrice,
  updateBulkPrice,
  deleteBulkPrice,
};
