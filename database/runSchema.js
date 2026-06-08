require('dotenv').config({ path: require('path').resolve(__dirname, '../backend/.env') });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DATABASE_URL && !DB_HOST) {
  console.error('❌ Database connection not configured.');
  process.exit(1);
}

const poolConfig = DATABASE_URL
  ? {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: DB_HOST,
      port: parseInt(DB_PORT, 10) || 6543,
      database: DB_NAME || 'postgres',
      user: DB_USER,
      password: DB_PASSWORD,
      ssl: { rejectUnauthorized: false },
    };

const pool = new Pool(poolConfig);

async function runSchema() {
  console.log('🔌 Connecting to database to apply schema...');
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📜 Executing schema.sql...');
    await pool.query(schemaSql);
    console.log('✅ Schema applied successfully!');
  } catch (error) {
    console.error('❌ Failed to apply schema:', error);
  } finally {
    await pool.end();
  }
}

runSchema();
