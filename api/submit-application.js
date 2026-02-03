import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

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

    const baseProjectData = (projectData && typeof projectData === 'object') ? projectData : {};
    const finalProjectData = {
      ...baseProjectData,
      userId: userId || 'guest-user',
      activationFee: 160,
      submittedAt: new Date().toISOString(),
      jobTitle: jobTitle || null,
    };

    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const insertRow = async (rowEmail) => {
      return await supabase
        .from('applications')
        .insert({
          project_name: 'CANADAADS',
          full_name: finalFullName,
          email: rowEmail,
          phone: normalizedPhone,
          project_data: finalProjectData,
          payment_reference: paymentReference || null,
          payment_status: 'unpaid',
          payment_amount: 160,
          ip_address: ipAddress.split(',')[0].trim(),
          user_agent: userAgent
        })
        .select()
        .single();
    };

    let { data, error } = await insertRow(finalEmail);

    if (error && normalizedEmail && isDuplicateEmailError(error)) {
      const { data: existing, error: fetchError } = await supabase
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
