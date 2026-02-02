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
  // Fallback: use the same Supabase project CANADAADS already uses.
  return supabase;
}

// SwiftPay M-Pesa Verification Proxy
const MPESA_PROXY_URL = process.env.MPESA_PROXY_URL || 'https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy';
const MPESA_PROXY_API_KEY = process.env.MPESA_PROXY_API_KEY || '';

// Query M-Pesa payment status via SwiftPay proxy
async function queryMpesaPaymentStatus(checkoutId) {
  try {
    console.log(`Querying M-Pesa status for ${checkoutId} via proxy`);
    
    const response = await fetch(MPESA_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        checkoutId: checkoutId,
        apiKey: MPESA_PROXY_API_KEY
      })
    });

    if (!response.ok) {
      console.error('Proxy response status:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Proxy response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error querying M-Pesa via proxy:', error.message);
    return null;
  }
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { reference } = req.query;
    
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }
    
    console.log('Checking status for reference:', reference);

    const appSupabase = getApplicationsSupabaseClient();
    const { data: paymentAttempt, error: attemptError } = await appSupabase
      .from('payment_attempts')
      .select('*')
      .eq('checkout_request_id', reference)
      .maybeSingle();

    if (attemptError) {
      console.error('payment_attempts query error:', attemptError);
    }

    let paymentStatus = 'PENDING';
    let receipt = null;
    let resultCode = null;
    let resultDesc = null;

    try {
      const proxyResponse = await queryMpesaPaymentStatus(reference);
      if (proxyResponse && proxyResponse.success && proxyResponse.payment?.status === 'success') {
        paymentStatus = 'SUCCESS';
        receipt = proxyResponse.payment?.receipt_number || proxyResponse.payment?.mpesaReceiptNumber || null;
      } else if (proxyResponse && proxyResponse.payment?.status === 'failed') {
        paymentStatus = 'FAILED';
      }
    } catch (proxyError) {
      console.error('Error querying M-Pesa via proxy:', proxyError);
    }

    const newAttemptStatus = paymentStatus === 'SUCCESS' ? 'success' : paymentStatus === 'FAILED' ? 'failed' : 'pending';

    try {
      const { error: payUpdateError } = await appSupabase
        .from('payment_attempts')
        .update({ status: newAttemptStatus })
        .eq('checkout_request_id', reference);

      if (payUpdateError) {
        console.error('payment_attempts update error:', payUpdateError);
      }
    } catch (e) {
      console.error('Failed to update payment_attempts:', e);
    }

    if (newAttemptStatus === 'success') {
      try {
        const { error: applicationsUpdateError } = await appSupabase
          .from('applications')
          .update({ payment_status: 'paid' })
          .eq('payment_reference', reference);

        if (applicationsUpdateError) {
          console.error('applications update error:', applicationsUpdateError);
        }
      } catch (e) {
        console.error('Failed to update applications payment_status:', e);
      }
    }

    return res.status(200).json({
      success: true,
      payment: {
        status: paymentStatus,
        amount: paymentAttempt?.amount ?? null,
        phoneNumber: paymentAttempt?.phone_number ?? null,
        mpesaReceiptNumber: receipt,
        resultDesc: resultDesc,
        resultCode: resultCode,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Payment status check error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message || String(error)
    });
  }
};
