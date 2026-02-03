import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.APP_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.APP_SUPABASE_ANON_KEY;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
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
    const supabase = getSupabaseClient();
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Server misconfigured: missing Supabase credentials',
      });
    }

    const body = req.body || {};
    const { email, password } = body;

    if (!email) return res.status(400).json({ success: false, message: 'Missing required field: email' });
    if (!password) return res.status(400).json({ success: false, message: 'Missing required field: password' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ success: false, message: error.message, error });
    }

    const authUser = data?.user;
    if (!authUser?.id) {
      return res.status(500).json({ success: false, message: 'Login failed: no user returned' });
    }

    const meta = authUser.user_metadata || {};
    const userData = {
      id: authUser.id,
      username: meta.username || (typeof email === 'string' ? email.split('@')[0] : ''),
      email: authUser.email || email,
      fullName: meta.full_name || meta.fullName || '',
      phone: meta.phone || '',
      location: meta.location || '',
      dateOfBirth: meta.date_of_birth || '',
      positionApplied: meta.position_applied || '',
      createdAt: authUser.created_at || new Date().toISOString(),
    };

    return res.status(200).json({ success: true, user: userData });
  } catch (err) {
    console.error('auth-login error:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Internal server error' });
  }
};
