// ============================================================================
// VOLKSCHEM OMS — Auth Service
// ============================================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');
const env = require('../config/env');

/**
 * Authenticate user by username and password.
 * Returns JWT token on success.
 */
async function login(username, password, meta = {}) {
  // Find user by username
  console.log('[AUTH SVC] Querying Supabase for user:', username);
  const { data: user, error } = await supabase
    .from('users')
    .select('id, username, password_hash, role, full_name, is_active')
    .eq('username', username)
    .single();

  console.log('[AUTH SVC] Supabase result - error:', error?.message || 'none', '| user found:', !!user);
  if (user) {
    console.log('[AUTH SVC] User details - id:', user.id, 'role:', user.role, 'active:', user.is_active, 'hash length:', user.password_hash?.length);
  }

  // Log attempt helper
  const logAttempt = async (userId, success, failureReason = null) => {
    try {
      await supabase.from('login_logs').insert({
        username_attempted: username,
        user_id: userId,
        ip_address: meta.ip || null,
        user_agent: meta.userAgent || null,
        success,
        failure_reason: failureReason,
      });
    } catch (logErr) {
      console.log('[AUTH SVC] Failed to write login log:', logErr.message);
    }
  };

  if (error || !user) {
    await logAttempt(null, false, 'User not found');
    throw Object.assign(new Error('Invalid username or password.'), { statusCode: 401 });
  }

  if (!user.is_active) {
    await logAttempt(user.id, false, 'Account deactivated');
    throw Object.assign(new Error('Your account has been deactivated. Contact admin.'), { statusCode: 401 });
  }

  // Compare password
  console.log('[AUTH SVC] Comparing password with bcrypt...');
  const isMatch = await bcrypt.compare(password, user.password_hash);
  console.log('[AUTH SVC] bcrypt.compare result:', isMatch);
  if (!isMatch) {
    await logAttempt(user.id, false, 'Invalid password');
    throw Object.assign(new Error('Invalid username or password.'), { statusCode: 401 });
  }

  // Generate JWT
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    full_name: user.full_name,
  };

  const token = jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

  // Log successful login
  await logAttempt(user.id, true);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
    },
  };
}

/**
 * Get current user profile by ID.
 */
async function getMe(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('id, username, role, full_name, phone, joining_date, is_active, created_at')
    .eq('id', userId)
    .single();

  if (error || !data) {
    throw Object.assign(new Error('User not found.'), { statusCode: 404 });
  }

  return data;
}

module.exports = { login, getMe };
