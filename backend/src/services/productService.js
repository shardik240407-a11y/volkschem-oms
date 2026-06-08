// ============================================================================
// VOLKSCHEM OMS — Product Service
// ============================================================================

const supabase = require('../config/db');

async function getAllProducts(filters = {}) {
  let query = supabase
    .from('products')
    .select('*')
    .order('product_name', { ascending: true });

  if (filters.order_type) {
    query = query.eq('order_type', filters.order_type);
  }
  if (filters.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  } else {
    // Default: only active products
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw Object.assign(new Error('Product not found.'), { statusCode: 404 });
  }
  return data;
}

async function createProduct(productData, createdBy) {
  // Check duplicate product_code
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('product_code', productData.product_code)
    .single();

  if (existing) {
    throw Object.assign(new Error('Product code already exists.'), { statusCode: 409 });
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      product_code: productData.product_code,
      product_name: productData.product_name,
      technical_combination: productData.technical_combination || null,
      bulk_rate_per_ltr_kg: productData.bulk_rate_per_ltr_kg,
      rate_unit: productData.rate_unit,
      order_type: productData.order_type,
      gst_rate: productData.gst_rate || 18.00,
      available_packing_types: productData.available_packing_types || [],
      created_by: createdBy,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

async function updateProduct(id, updates) {
  const allowed = [
    'product_code', 'product_name', 'technical_combination', 'bulk_rate_per_ltr_kg',
    'rate_unit', 'order_type', 'gst_rate', 'available_packing_types',
  ];
  const cleaned = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) cleaned[key] = updates[key];
  }

  if (cleaned.product_code) {
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('product_code', cleaned.product_code)
      .neq('id', id)
      .single();

    if (existing) {
      throw Object.assign(new Error('Product code already exists.'), { statusCode: 409 });
    }
  }

  if (Object.keys(cleaned).length === 0) {
    throw Object.assign(new Error('No valid fields to update.'), { statusCode: 400 });
  }

  const { data, error } = await supabase
    .from('products')
    .update(cleaned)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  if (!data) throw Object.assign(new Error('Product not found.'), { statusCode: 404 });
  return data;
}

async function deleteProduct(id) {
  // Soft delete and rename product_code so it can be reused
  const { data: prod, error: fetchError } = await supabase
    .from('products')
    .select('product_code')
    .eq('id', id)
    .single();

  if (fetchError || !prod) {
    throw Object.assign(new Error('Product not found.'), { statusCode: 404 });
  }

  let newCode = prod.product_code;
  if (!newCode.includes('_d_')) {
     const rand = Math.floor(1000 + Math.random() * 9000);
     newCode = `${newCode.substring(0, 13)}_d_${rand}`;
  }

  const { data, error } = await supabase
    .from('products')
    .update({ is_active: false, product_code: newCode })
    .eq('id', id)
    .select('id, product_code, product_name, is_active')
    .single();

  if (error) throw error;
  if (!data) throw Object.assign(new Error('Product not found.'), { statusCode: 404 });
  return data;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
