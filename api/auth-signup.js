import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.APP_SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.APP_SUPABASE_ANON_KEY;

function getSupabaseClient(key) {
  if (!supabaseUrl || !key) return null;
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const body = req.body || {};
    const { email, password, metadata } = body;

    if (!email) return res.status(400).json({ success: false, message: 'Missing required field: email' });
    if (!password) return res.status(400).json({ success: false, message: 'Missing required field: password' });

    const adminClient = serviceRoleKey ? getSupabaseClient(serviceRoleKey) : null;
    const authClient = getSupabaseClient(anonKey || serviceRoleKey);

    if (!authClient) {
      return res.status(500).json({
        success: false,
        message: 'Server misconfigured: missing Supabase credentials',
      });
    }

    let createdUser = null;

    if (adminClient) {
      const { data: createData, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: metadata || {},
      });

      if (createError) {
        return res.status(400).json({ success: false, message: createError.message, error: createError });
      }

      createdUser = createData?.user || null;
    } else {
      const { data: signUpData, error: signUpError } = await authClient.auth.signUp({
        email,
        password,
        options: { data: metadata || {} },
      });

      if (signUpError) {
        return res.status(400).json({ success: false, message: signUpError.message, error: signUpError });
      }

      createdUser = signUpData?.user || null;
    }

    if (!createdUser?.id) {
      return res.status(500).json({ success: false, message: 'Signup failed: no user returned' });
    }

    const meta = createdUser.user_metadata || {};
    const userData = {
      id: createdUser.id,
      username: meta.username || (typeof email === 'string' ? email.split('@')[0] : ''),
      email: createdUser.email || email,
      fullName: meta.full_name || meta.fullName || '',
      phone: meta.phone || '',
      location: meta.location || '',
      dateOfBirth: meta.date_of_birth || '',
      positionApplied: meta.position_applied || '',
      createdAt: createdUser.created_at || new Date().toISOString(),
    };

    return res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error('auth-signup error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Internal server error' });
  }
};
