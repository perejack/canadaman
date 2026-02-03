import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.APP_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.APP_SUPABASE_ANON_KEY;

let supabase = null;
function getSupabaseClient() {
  if (supabase) return supabase;
  if (!supabaseUrl || !supabaseKey) return null;
  supabase = createClient(supabaseUrl, supabaseKey);
  return supabase;
}

function isDuplicateEmailError(error) {
  const message = String(error?.message || '');
  return error?.code === '23505' || /duplicate key/i.test(message) || /unique constraint/i.test(message);
}

function normalizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

function normalizePhoneNumber(phone) {
  if (typeof phone !== 'string') return '';
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+')) cleaned = cleaned.slice(1);
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
    return '';
  }
  return cleaned;
}

function createFallbackEmail() {
  return `canadaads+${Date.now()}@application.com`;
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const supabaseClient = getSupabaseClient();
    if (!supabaseClient) {
      return res.status(500).json({
        success: false,
        message: 'Server misconfigured: missing Supabase credentials',
        error: 'Set APP_SUPABASE_URL + APP_SUPABASE_SERVICE_ROLE_KEY (preferred) or VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.'
      });
    }

    const body = req.body || {};
    const { phone, userId, paymentReference, email, fullName, jobTitle, projectData } = body;
    if (!phone) return res.status(400).json({ success: false, message: 'Missing required field: phone' });

    const normalizedPhone = normalizePhoneNumber(String(phone));
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number. Use 07XXXXXXXX or 254XXXXXXXXX' });
    }

    const normalizedEmail = normalizeEmail(email);
    const finalEmail = normalizedEmail || createFallbackEmail();
    const finalFullName = (typeof fullName === 'string' && fullName.trim()) ? fullName.trim() : (userId || 'Canada Ads User');

    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const insertRow = async (rowEmail) => {
      return await supabaseClient
        .from('applications')
        .insert({
          first_name: projectData?.first_name || '',
          last_name: projectData?.last_name || '',
          email: rowEmail,
          phone: normalizedPhone,
          date_of_birth: projectData?.date_of_birth || null,
          id_number: projectData?.id_number || null,
          position_applied: jobTitle || 'Unknown'
        })
        .select()
        .single();
    };

    let { data, error } = await insertRow(finalEmail);

    if (error && normalizedEmail && isDuplicateEmailError(error)) {
      const { data: existing, error: fetchError } = await supabaseClient
        .from('applications')
        .select('id, payment_reference')
        .eq('email', finalEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!fetchError && existing?.id) {
        console.log('Application already exists for email:', existing.id);
        return res.status(200).json({
          success: true,
          message: 'Application already submitted',
          data: { applicationId: existing.id, reference: existing.payment_reference }
        });
      }

      const parts = finalEmail.split('@');
      const local = parts[0] || 'canadaads';
      const domain = parts[1] || 'application.com';
      const retryEmail = `${local}+${Date.now()}@${domain}`;
      ({ data, error } = await insertRow(retryEmail));
    }

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({ success: false, message: 'Failed to save application', error: error.message });
    }

    console.log('Application saved successfully:', data.id);
    return res.status(200).json({ success: true, message: 'Application submitted successfully', data: { applicationId: data.id, reference: data.payment_reference } });
  } catch (error) {
    console.error('Submit application error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
