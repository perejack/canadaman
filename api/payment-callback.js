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

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};

    console.log('=== PesaFlux Webhook Received ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Payload:', JSON.stringify(payload, null, 2));

    if (!payload.TransactionID && !payload.CheckoutRequestID) {
      console.error('Invalid webhook: Missing TransactionID and CheckoutRequestID');
      return res.status(400).json({
        status: 'error',
        message: 'Invalid webhook data'
      });
    }

    const {
      ResponseCode,
      ResponseDescription,
      TransactionID,
      TransactionAmount,
      TransactionReceipt,
      TransactionDate,
      TransactionReference,
      Msisdn,
      MerchantRequestID,
      CheckoutRequestID,
    } = payload;

    let status = 'failed';
    let statusMessage = ResponseDescription;

    if (ResponseCode === 0) {
      status = 'success';
      statusMessage = 'Payment completed successfully';
    } else if (ResponseCode === 1032 || ResponseCode === 1031 || ResponseCode === 1) {
      status = 'cancelled';
      statusMessage = 'Payment was cancelled by user';
    } else if (ResponseCode === 1037) {
      console.log('Timeout response received - ignoring webhook');
      return res.status(200).json({
        status: 'received',
        message: 'Timeout webhook ignored'
      });
    }

    let parsedDate = null;
    if (TransactionDate && TransactionDate.length === 14) {
      try {
        const year = TransactionDate.substring(0, 4);
        const month = TransactionDate.substring(4, 6);
        const day = TransactionDate.substring(6, 8);
        const hour = TransactionDate.substring(8, 10);
        const minute = TransactionDate.substring(10, 12);
        const second = TransactionDate.substring(12, 14);
        parsedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      } catch (dateErr) {
        console.error('Date parsing error:', dateErr);
      }
    }

    const appSupabase = getApplicationsSupabaseClient();

    const newAttemptStatus = status === 'success' ? 'success' : status === 'cancelled' ? 'cancelled' : 'failed';

    if (CheckoutRequestID) {
      const { data: paymentAttempt, error: attemptFetchError } = await appSupabase
        .from('payment_attempts')
        .select('id, application_id')
        .eq('checkout_request_id', CheckoutRequestID)
        .maybeSingle();

      if (attemptFetchError) {
        console.error('payment_attempts fetch error:', attemptFetchError);
      }

      const { error: attemptUpdateError } = await appSupabase
        .from('payment_attempts')
        .update({
          status: newAttemptStatus,
        })
        .eq('checkout_request_id', CheckoutRequestID);

      if (attemptUpdateError) {
        console.error('payment_attempts update error:', attemptUpdateError);
      }

      if (status === 'success') {
        const applicationsUpdateQuery = appSupabase
          .from('applications')
          .update({ payment_status: 'paid', payment_reference: CheckoutRequestID });

        const { error: applicationsUpdateError } = paymentAttempt?.application_id
          ? await applicationsUpdateQuery.eq('id', paymentAttempt.application_id)
          : await applicationsUpdateQuery.eq('payment_reference', CheckoutRequestID);

        if (applicationsUpdateError) {
          console.error('applications update error:', applicationsUpdateError);
        }
      }
    } else {
      console.error('CheckoutRequestID missing - cannot update payment_attempts');
    }

    return res.status(200).json({
      status: 'success',
      message: 'Webhook processed successfully'
    });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Webhook received but processing failed',
      error: error.message || String(error)
    });
  }
};
