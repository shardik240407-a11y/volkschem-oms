// ============================================================================
// VOLKSCHEM OMS — Admin User Seed
// Creates the default admin user: volkschem_admin / Admin@2025
// ============================================================================

const bcrypt = require('bcryptjs');

const ADMIN_USER = {
  username: 'volkschem_admin',
  password: 'Admin@2025',
  role: 'admin',
  full_name: 'Volkschem Administrator',
};

/**
 * Seeds the default admin user into the users table.
 * Uses ON CONFLICT to avoid duplicates on re-runs.
 *
 * @param {import('pg').Pool} pool - PostgreSQL connection pool
 */
async function seedAdminUser(pool) {
  console.log('\n🔐 Seeding admin user...');

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(ADMIN_USER.password, saltRounds);

  const query = `
    INSERT INTO users (username, password_hash, role, full_name, joining_date, is_active)
    VALUES ($1, $2, $3, $4, CURRENT_DATE, true)
    ON CONFLICT (username) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      full_name = EXCLUDED.full_name,
      updated_at = NOW()
    RETURNING id, username, role, full_name;
  `;

  const values = [
    ADMIN_USER.username,
    passwordHash,
    ADMIN_USER.role,
    ADMIN_USER.full_name,
  ];

  try {
    const result = await pool.query(query, values);
    const user = result.rows[0];
    console.log(`   ✅ Admin user created/updated:`);
    console.log(`      ID:       ${user.id}`);
    console.log(`      Username: ${user.username}`);
    console.log(`      Role:     ${user.role}`);
    console.log(`      Name:     ${user.full_name}`);
    return user;
  } catch (error) {
    console.error('   ❌ Failed to seed admin user:', error.message);
    throw error;
  }
}

module.exports = { seedAdminUser };
