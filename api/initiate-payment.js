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

// SwiftPay Configuration
const SWIFTPAY_API_KEY = process.env.SWIFTPAY_API_KEY;
const SWIFTPAY_TILL_ID = process.env.SWIFTPAY_TILL_ID;
const SWIFTPAY_BACKEND_URL = process.env.SWIFTPAY_BACKEND_URL || 'https://swiftpay-backend-uvv9.onrender.com';
const MPESA_PROXY_URL = process.env.MPESA_PROXY_URL || 'https://swiftpay-backend-uvv9.onrender.com/api/mpesa-verification-proxy';
const MPESA_PROXY_API_KEY = process.env.MPESA_PROXY_API_KEY || '';

if (!SWIFTPAY_API_KEY || !SWIFTPAY_TILL_ID) {
  throw new Error('SWIFTPAY_API_KEY and SWIFTPAY_TILL_ID must be set in environment variables');
}

// Normalize phone number to 254 format
function normalizePhoneNumber(phone) {
  if (!phone) return null;
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  }
  if (cleaned.length !== 12 || !/^\d+$/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    if (!req.body) {
      console.error('Request body is missing or empty');
      return res.status(400).json({ success: false, message: 'Request body is missing or invalid' });
    }
    let {
      phoneNumber,
      amount = 250,
      description = 'Account Verification Fee',
      applicationId,
      interviewBookingId,
      purpose,
    } = req.body;

    console.log('Parsed request:', { phoneNumber, amount, description });

    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: 'Invalid phone number format. Use 07XXXXXXXX or 254XXXXXXXXX' });
    }

    const externalReference = `CANADAADS-${Date.now()}`;

    const swiftpayPayload = {
      phone_number: normalizedPhone,
      amount: amount,
      till_id: SWIFTPAY_TILL_ID
    };

    console.log('Making API request to SwiftPay');

    const response = await fetch(`${SWIFTPAY_BACKEND_URL}/api/mpesa/stk-push-api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SWIFTPAY_API_KEY}`,
      },
      body: JSON.stringify(swiftpayPayload),
    });

    const responseText = await response.text();
    console.log('SwiftPay response status:', response.status);
    console.log('SwiftPay response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse SwiftPay response:', responseText);
      return res.status(502).json({
        success: false,
        message: 'Invalid response from payment service'
      });
    }

    if (response.ok && (data.success === true || data.status === 'success')) {
      const checkoutId = data.data?.checkout_id || data.data?.request_id || data.CheckoutRequestID || externalReference;

      // Insert into payment_attempts (Applications DB)
      try {
        const appSupabase = getApplicationsSupabaseClient();

        // Adjust payload based on what you're paying for (application or interview_booking)
        const resolvedPurpose =
          purpose || (interviewBookingId ? 'interview_booking' : applicationId ? 'application' : 'unknown');

        const { error: payError } = await appSupabase
          .from('payment_attempts')
          .insert({
            user_id: null, // set if you have the user
            application_id: applicationId || null,
            interview_booking_id: interviewBookingId || null,
            purpose: resolvedPurpose,
            checkout_request_id: checkoutId,
            phone_number: normalizedPhone,
            amount: parseFloat(amount),
            status: 'pending'
          });

        if (payError) {
          console.error('payment_attempts insert error:', payError);
        } else {
          console.log('payment_attempts row created:', checkoutId);
        }

        if (applicationId) {
          const { error: applicationUpdateError } = await appSupabase
            .from('applications')
            .update({ payment_reference: checkoutId, payment_status: 'pending' })
            .eq('id', applicationId);

          if (applicationUpdateError) {
            console.error('applications update error:', applicationUpdateError);
          }
        }
      } catch (e) {
        console.error('Failed to insert payment_attempts:', e);
      }

      return res.status(200).json({
        success: true,
        message: 'Payment initiated successfully',
        data: {
          requestId: checkoutId,
          checkoutRequestId: checkoutId,
          transactionRequestId: checkoutId
        }
      });
    } else {
      console.error('SwiftPay error:', data);
      return res.status(400).json({
        success: false,
        message: data.message || 'Payment initiation failed',
        error: data
      });
    }
  } catch (error) {
    console.error('Global error in initiate-payment:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred',
      error: error.message || String(error)
    });
  }
};
