import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.APP_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.APP_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.APP_SUPABASE_ANON_KEY;

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

function isUuid(value) {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
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
      userId,
      interviewCompany,
      interviewPosition,
      interviewType,
      interviewAt,
      interviewStatus,
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
      
      try {
        const appSupabase = getApplicationsSupabaseClient();

        const safeUserId = isUuid(userId) ? userId : null;
        let safeApplicationId = isUuid(applicationId) ? applicationId : null;
        let safeInterviewBookingId = isUuid(interviewBookingId) ? interviewBookingId : null;

        if (!safeInterviewBookingId && (purpose === 'interview_booking' || interviewCompany || interviewPosition)) {
          console.log('Attempting to create interview booking:', { interviewCompany, interviewPosition, interviewType, interviewAt, interviewStatus });

          if (!interviewAt) {
            console.error('interview_bookings insert error: interview_at is required for interview bookings');
          } else {
            try {
              const bookingUserId = safeUserId || randomUUID();
              const { data: createdBooking, error: bookingInsertError } = await appSupabase
                .from('interview_bookings')
                .insert({
                  user_id: bookingUserId,
                  company: interviewCompany || null,
                  position: interviewPosition || null,
                  interview_type: interviewType || null,
                  interview_at: interviewAt,
                  status: interviewStatus || 'pending_payment',
                })
                .select('id')
                .single();

              if (bookingInsertError) {
                console.error('interview_bookings insert error:', bookingInsertError);
              } else if (createdBooking?.id) {
                console.log('Interview booking created successfully:', createdBooking.id);
                safeInterviewBookingId = createdBooking.id;
              } else {
                console.error('interview_bookings insert: no data returned');
              }
            } catch (bookingErr) {
              console.error('Error creating interview booking:', bookingErr);
            }
          }
        }

        const inferredPurpose = purpose || (safeApplicationId ? 'application' : safeInterviewBookingId ? 'interview_booking' : 'unknown');
        console.log('Inserting payment attempt:', {
          user_id: safeUserId,
          application_id: safeApplicationId,
          interview_booking_id: safeInterviewBookingId,
          purpose: inferredPurpose,
          checkout_request_id: checkoutId,
          phone_number: normalizedPhone,
          amount: parseFloat(amount),
          status: 'pending',
        });

        const { error: dbError } = await appSupabase
          .from('payment_attempts')
          .insert({
            user_id: safeUserId,
            application_id: safeApplicationId,
            interview_booking_id: safeInterviewBookingId,
            purpose: inferredPurpose,
            checkout_request_id: checkoutId,
            phone_number: normalizedPhone,
            amount: parseFloat(amount),
            status: 'pending',
          });

        if (dbError) {
          console.error('Database insert error:', dbError);
        } else {
          console.log('Payment attempt stored in database:', checkoutId);
        }
      } catch (dbErr) {
        console.error('Database error:', dbErr);
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
