// ============================================================================
// VOLKSCHEM OMS — Seed Runner
// Runs all seed files in correct order against Supabase PostgreSQL
// ============================================================================

require('dotenv').config({ path: require('path').resolve(__dirname, '../../backend/.env') });

const { Pool } = require('pg');
const { seedAdminUser } = require('./adminUserSeed');
const { seedCostSheetRates } = require('./costSheetSeed');
const { seedSampleData } = require('./sampleDataSeed');

// ---------------------------------------------------------------------------
// Configuration — supports both DATABASE_URL and individual DB_* variables
// ---------------------------------------------------------------------------
const DATABASE_URL = process.env.DATABASE_URL;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (!DATABASE_URL && !DB_HOST) {
  console.error('❌ Database connection not configured.');
  console.error('   Please set DATABASE_URL or DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD in backend/.env');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main Seed Runner
// ---------------------------------------------------------------------------
async function runSeeds() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║          VOLKSCHEM OMS — Database Seed Runner           ║');
  console.log('╠══════════════════════════════════════════════════════════╣');
  console.log('║  Company: Volkschem Crop Science Pvt. Ltd.              ║');
  console.log('║  GST:     24AAFCV2675N1ZU                              ║');
  console.log('╚══════════════════════════════════════════════════════════╝');

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

  try {
    // Test connection
    console.log('\n🔌 Connecting to database...');
    const client = await pool.connect();
    const dbResult = await client.query('SELECT current_database(), current_user, version()');
    console.log(`   ✅ Connected to: ${dbResult.rows[0].current_database}`);
    console.log(`   👤 As user:      ${dbResult.rows[0].current_user}`);
    client.release();

    // -----------------------------------------------------------------------
    // Run seeds in order
    // -----------------------------------------------------------------------

    // 1. Admin user first (other seeds may reference admin user ID)
    await seedAdminUser(pool);

    // 2. Cost sheet rates
    await seedCostSheetRates(pool);

    // 3. Products & Bulk Prices
    await seedSampleData(pool);

    // -----------------------------------------------------------------------
    // Done
    // -----------------------------------------------------------------------
    console.log('\n╔══════════════════════════════════════════════════════════╗');
    console.log('║              ✅ ALL SEEDS COMPLETED SUCCESSFULLY        ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n╔══════════════════════════════════════════════════════════╗');
    console.error('║              ❌ SEED RUNNER FAILED                      ║');
    console.error('╚══════════════════════════════════════════════════════════╝');
    console.error('\nError details:', error.message);

    if (error.message.includes('relation') && error.message.includes('does not exist')) {
      console.error('\n💡 Hint: Have you run the schema.sql first?');
      console.error('   Run: psql $DATABASE_URL -f database/schema.sql');
      console.error('   Or paste schema.sql into the Supabase SQL Editor.');
    }

    process.exit(1);
  } finally {
    await pool.end();
    console.log('🔌 Database connection pool closed.');
  }
}

// Run
runSeeds();
