// Run from backend folder: node ../diagnose_login.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

async function go() {
  // 1. Direct PG test
  console.log('=== STEP 1: Direct PostgreSQL ===');
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 6543,
    database: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  const r = await pool.query("SELECT id, username, role, is_active, password_hash FROM users WHERE username = 'volkschem_admin'");
  if (r.rows.length === 0) {
    console.log('❌ NO USER FOUND in database!');
    await pool.end();
    return;
  }
  const u = r.rows[0];
  console.log('✅ User found:', u.id, 'role:', u.role, 'active:', u.is_active);
  console.log('   Hash:', u.password_hash.substring(0, 30) + '...');

  const match = await bcrypt.compare('Admin@2025', u.password_hash);
  console.log('   bcrypt.compare result:', match);
  if (!match) {
    console.log('   ❌ Hash mismatch! Re-hashing and updating...');
    const newHash = await bcrypt.hash('Admin@2025', 12);
    await pool.query("UPDATE users SET password_hash = $1 WHERE username = 'volkschem_admin'", [newHash]);
    console.log('   ✅ Password re-hashed and saved.');
  }
  await pool.end();

  // 2. Supabase client test
  console.log('\n=== STEP 2: Supabase JS Client ===');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key-here')
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_ANON_KEY;
  console.log('Using key type:', key === process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE' : 'ANON');

  const sb = createClient(process.env.SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  const { data, error } = await sb
    .from('users')
    .select('id, username, role, password_hash, is_active')
    .eq('username', 'volkschem_admin')
    .single();

  if (error) {
    console.log('❌ Supabase query FAILED:', error.message);
    console.log('   Code:', error.code, '| Hint:', error.hint);
    console.log('   Details:', JSON.stringify(error.details));
    console.log('\n   → The Supabase anon key CANNOT read the users table.');
    console.log('   → FIX: Use service role key OR run disable_rls.sql in Supabase SQL Editor.');
  } else if (!data) {
    console.log('❌ Supabase returned null data (no error)');
  } else {
    console.log('✅ Supabase found user:', data.id, 'role:', data.role);
    const m2 = await bcrypt.compare('Admin@2025', data.password_hash);
    console.log('   bcrypt via Supabase:', m2);
    if (m2) {
      console.log('\n🎉 LOGIN SHOULD WORK! Restart backend and try again.');
    }
  }
}

go().catch(e => console.error('Fatal:', e.message));
