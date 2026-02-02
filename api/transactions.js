import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for the Applications DB (or APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY).'
  );
}

const anonSupabase = createClient(supabaseUrl, supabaseKey);

function getApplicationsSupabaseClient() {
  if (process.env.APP_SUPABASE_URL && process.env.APP_SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(process.env.APP_SUPABASE_URL, process.env.APP_SUPABASE_SERVICE_ROLE_KEY);
  }
  return anonSupabase;
}

function getAdminToken(req) {
  const header = req.headers['x-admin-token'] || req.headers['X-Admin-Token'];
  if (typeof header === 'string' && header.trim()) return header.trim();

  const auth = req.headers.authorization || req.headers.Authorization;
  if (typeof auth === 'string') {
    const match = auth.match(/^Bearer\s+(.+)$/i);
    if (match?.[1]) return match[1].trim();
  }

  return '';
}

function parsePositiveInt(val, fallback) {
  const parsed = Number.parseInt(String(val ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const expectedToken = process.env.TRANSACTIONS_ADMIN_TOKEN || '';
  const providedToken = getAdminToken(req);

  if (isProduction) {
    if (!expectedToken) {
      return res.status(500).json({ success: false, message: 'Server misconfigured' });
    }
    if (providedToken !== expectedToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } else {
    if (expectedToken && providedToken !== expectedToken) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  }

  try {
    const supabase = getApplicationsSupabaseClient();

    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = Math.min(parsePositiveInt(req.query.pageSize, 25), 200);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const purpose = typeof req.query.purpose === 'string' ? req.query.purpose.trim() : '';
    const status = typeof req.query.status === 'string' ? req.query.status.trim() : '';

    let query = supabase
      .from('transactions_explorer')
      .select('*', { count: 'exact' })
      .order('payment_created_at', { ascending: false });

    if (purpose) {
      query = query.eq('purpose', purpose);
    }

    if (status) {
      query = query.eq('payment_status', status);
    }

    if (q) {
      const safe = q.replace(/%/g, '\\%').replace(/,/g, '');
      query = query.or(
        [
          `checkout_request_id.ilike.%${safe}%`,
          `phone_number.ilike.%${safe}%`,
          `interview_company.ilike.%${safe}%`,
          `interview_position.ilike.%${safe}%`,
          `application_email.ilike.%${safe}%`,
          `application_job_title.ilike.%${safe}%`,
        ].join(',')
      );
    }

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('transactions query error:', error);
      return res.status(500).json({ success: false, message: 'Failed to load transactions', error: error.message });
    }

    return res.status(200).json({
      success: true,
      data: data || [],
      count: typeof count === 'number' ? count : null,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('transactions api error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message || String(error) });
  }
};
