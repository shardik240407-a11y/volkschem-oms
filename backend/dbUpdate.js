require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const poolConfig = DATABASE_URL
  ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : { host: DB_HOST, port: parseInt(DB_PORT, 10) || 6543, database: DB_NAME || 'postgres', user: DB_USER, password: DB_PASSWORD, ssl: { rejectUnauthorized: false } };

const pool = new Pool(poolConfig);

async function run() {
  try {
    await pool.query('ALTER TABLE quotation_rows ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id);');
    console.log('Successfully added product_id to quotation_rows');
    // Also, fetch existing quotations and update quotation_rows to copy product_id
    await pool.query(`
      UPDATE quotation_rows 
      SET product_id = quotations.product_id
      FROM quotations
      WHERE quotation_rows.quotation_id = quotations.id
      AND quotation_rows.product_id IS NULL;
    `);
    console.log('Successfully backfilled product_id on existing quotation_rows');
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
run();
