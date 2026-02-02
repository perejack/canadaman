import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.APP_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for the Applications DB (or APP_SUPABASE_URL and APP_SUPABASE_ANON_KEY).');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getApplicationsSupabaseClient() {
  if (process.env.APP_SUPABASE_URL && process.env.APP_SUPABASE_SERVICE_ROLE_KEY) {
    return createClient(process.env.APP_SUPABASE_URL, process.env.APP_SUPABASE_SERVICE_ROLE_KEY);
  }
  return supabase;
}

async function insertApplicationWithFallback(appSupabase, payload) {
  let current = { ...payload };

  for (let i = 0; i < 6; i++) {
    const { data, error } = await appSupabase
      .from('applications')
      .insert(current)
      .select('id')
      .single();

    if (!error) {
      return { data, error: null };
    }

    // If PostgREST says a column doesn't exist, remove it and retry.
    if (error.code === 'PGRST204' && typeof error.message === 'string') {
      const match = error.message.match(/Could not find the '([^']+)' column/);
      const missingCol = match?.[1];
      if (missingCol && Object.prototype.hasOwnProperty.call(current, missingCol)) {
        delete current[missingCol];
        continue;
      }
    }

    return { data: null, error };
  }

  return {
    data: null,
    error: {
      message: 'Failed to insert application after multiple retries. Please check your applications table columns.'
    }
  };
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const { phone, userId, paymentReference, email, fullName, jobTitle, formData } = req.body || {};
    if (!phone) return res.status(400).json({ success: false, message: 'Missing required field: phone' });

    const activationFee = 250;
    const safeEmail = email || `guest+${Date.now()}@canadaads.local`;
    const safeFullName = fullName || userId || 'Canada Ads User';
    const projectData = {
      userId: userId || 'guest-user',
      activationFee,
      submittedAt: new Date().toISOString(),
      jobTitle: jobTitle || null,
      formData: formData || null,
    };
    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const appSupabase = getApplicationsSupabaseClient();

    let insertPayload;

    if (jobTitle || formData) {
      insertPayload = {
        job_title: jobTitle || null,
        pending_email: safeEmail,
        source: 'interactive_form',
        user_id: userId || null,
        data: formData || null,
        payment_reference: paymentReference || null,
        payment_status: 'unpaid',
        payment_amount: activationFee,
      };
    } else {
      insertPayload = {
        project_name: 'CANADAADS',
        full_name: safeFullName,
        email: safeEmail,
        phone: phone,
        project_data: projectData,
        payment_reference: paymentReference || null,
        payment_status: 'unpaid',
        payment_amount: activationFee,
        ip_address: ipAddress.split(',')[0].trim(),
        user_agent: userAgent,
      };
    }

    const { data, error } = await insertApplicationWithFallback(appSupabase, insertPayload);

    if (error) {
      console.error('Database insert error:', error);
      return res.status(500).json({ success: false, message: 'Failed to save application', error: error.message || String(error) });
    }

    console.log('Application saved successfully:', data.id);
    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: { applicationId: data.id, reference: paymentReference || null }
    });
  } catch (error) {
    console.error('Submit application error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};
