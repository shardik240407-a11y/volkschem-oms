require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

async function go() {
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY !== 'your-service-role-key-here')
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.SUPABASE_ANON_KEY;
  console.log('Key type:', key === process.env.SUPABASE_ANON_KEY ? 'ANON' : 'SERVICE_ROLE');

  const sb = createClient(process.env.SUPABASE_URL, key, {
    auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  });

  // Test 1: List all users
  console.log('\n--- All users ---');
  const { data: allUsers, error: allErr } = await sb.from('users').select('id, username, role, is_active');
  if (allErr) {
    console.log('ERROR listing users:', allErr.message, allErr.code, allErr.hint);
  } else {
    console.log('Users found:', allUsers?.length || 0);
    allUsers?.forEach(u => console.log('  ', u.username, u.role, u.is_active));
  }

  // Test 2: Query specific user
  console.log('\n--- Query volkschem_admin ---');
  const { data, error } = await sb
    .from('users')
    .select('id, username, role, password_hash, is_active')
    .eq('username', 'volkschem_admin')
    .single();

  if (error) {
    console.log('ERROR:', error.message, '| code:', error.code, '| hint:', error.hint);
  } else if (!data) {
    console.log('No data returned');
  } else {
    console.log('Found:', data.id, data.role, 'active:', data.is_active);
    console.log('Hash length:', data.password_hash?.length);
    const match = await bcrypt.compare('Admin@2025', data.password_hash);
    console.log('bcrypt match:', match);
  }
}

go().catch(e => console.error('Fatal:', e.message));
