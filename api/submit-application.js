import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).send('');
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  try {
    const { phone, userId, paymentReference } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Missing required field: phone' });

    const projectData = { userId: userId || 'guest-user', activationFee: 160, submittedAt: new Date().toISOString() };
    const ipAddress = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';

    const { data, error } = await supabase.from('applications').insert({
      project_name: 'CANADAADS',
      full_name: userId || 'Canada Ads User',
      email: 'canadaads@application.com',
      phone: phone,
      project_data: projectData,
      payment_reference: paymentReference || null,
      payment_status: 'unpaid',
      payment_amount: 160,
      ip_address: ipAddress.split(',')[0].trim(),
      user_agent: userAgent
    }).select().single();

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
