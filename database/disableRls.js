// Quick script to disable RLS on all Volkschem OMS tables
require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 6543,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

const tables = [
  'users', 'products', 'cost_sheet_rates', 'quotations', 'quotation_rows',
  'quotation_components', 'orders', 'label_inventory', 'label_batches',
  'bulk_material_rates', 'login_logs',
];

async function run() {
  const client = await pool.connect();
  console.log('Connected. Disabling RLS on all tables...');
  for (const table of tables) {
    try {
      await client.query(`ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY`);
      console.log(`  ✅ ${table} — RLS disabled`);
    } catch (err) {
      console.log(`  ⚠️  ${table} — ${err.message}`);
    }
  }
  client.release();
  await pool.end();
  console.log('\nDone! RLS disabled on all tables. Restart your backend.');
}

run().catch(console.error);
