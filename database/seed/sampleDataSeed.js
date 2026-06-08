const { v4: uuidv4 } = require('uuid');

async function seedSampleData(pool) {
  console.log('\n📦 Seeding sample products and bulk prices...');

  const products = [
    {
      product_code: 'VC-001',
      product_name: 'IMIDA 17.8% SL',
      technical_combination: 'Imidacloprid 17.8% SL',
      bulk_rate_per_ltr_kg: 500.00,
      rate_unit: 'ltr',
      order_type: 'gujarat_brand',
      gst_rate: 18.00,
      available_packing_types: ['Bottle', 'Ampoule', 'Drum', 'Bucket', 'Pouch', 'Jar/Dabba']
    },
    {
      product_code: 'VC-002',
      product_name: 'GLYPHOSATE 41% SL',
      technical_combination: 'Glyphosate 41% SL',
      bulk_rate_per_ltr_kg: 350.00,
      rate_unit: 'ltr',
      order_type: 'gujarat_brand',
      gst_rate: 18.00,
      available_packing_types: ['Bottle', 'Ampoule', 'Drum', 'Bucket', 'Pouch', 'Jar/Dabba']
    },
    {
      product_code: 'VC-003',
      product_name: 'PROFENOFOS 50% EC',
      technical_combination: 'Profenofos 50% EC',
      bulk_rate_per_ltr_kg: 600.00,
      rate_unit: 'ltr',
      order_type: 'third_party',
      gst_rate: 18.00,
      available_packing_types: ['Bottle', 'Ampoule', 'Drum', 'Bucket', 'Pouch', 'Jar/Dabba']
    },
    {
      product_code: 'VC-004',
      product_name: 'THIAMETHOXAM 25% WG',
      technical_combination: 'Thiamethoxam 25% WG',
      bulk_rate_per_ltr_kg: 1200.00,
      rate_unit: 'kg',
      order_type: 'gujarat_brand',
      gst_rate: 18.00,
      available_packing_types: ['Bottle', 'Ampoule', 'Drum', 'Bucket', 'Pouch', 'Jar/Dabba']
    }
  ];

  const bulkPrices = [
    { material_name: 'Imidacloprid Technical', rate_per_unit: 450.00, unit: 'kg' },
    { material_name: 'Glyphosate Technical', rate_per_unit: 300.00, unit: 'kg' },
    { material_name: 'Solvent C-9', rate_per_unit: 85.00, unit: 'ltr' },
    { material_name: 'Emulsifier Blend', rate_per_unit: 150.00, unit: 'kg' }
  ];

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Clear existing sample data to prevent duplicate unique keys
    await client.query('DELETE FROM products');
    await client.query('DELETE FROM bulk_prices');

    // 2. Insert Products
    for (const p of products) {
      await client.query(
        `INSERT INTO products (product_code, product_name, technical_combination, bulk_rate_per_ltr_kg, rate_unit, order_type, gst_rate, available_packing_types)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [p.product_code, p.product_name, p.technical_combination, p.bulk_rate_per_ltr_kg, p.rate_unit, p.order_type, p.gst_rate, p.available_packing_types]
      );
    }
    console.log(`   ✅ Inserted ${products.length} sample products`);

    // 3. Insert Bulk Prices
    for (const bp of bulkPrices) {
      await client.query(
        `INSERT INTO bulk_prices (material_name, rate_per_unit, unit)
         VALUES ($1, $2, $3)`,
        [bp.material_name, bp.rate_per_unit, bp.unit]
      );
    }
    console.log(`   ✅ Inserted ${bulkPrices.length} sample bulk prices`);

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { seedSampleData };
