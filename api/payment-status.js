import { createClient } from '@supabase/supabase-js';

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
    
    const { data: attempt, error: dbError } = await appSupabase
      .from('payment_attempts')
      .select('*')
      .eq('checkout_request_id', reference)
      .maybeSingle();
    
    if (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error checking payment status',
        error: dbError.message || String(dbError)
      });
    }
    
    if (attempt) {
      console.log(`Payment status found for ${reference}:`, attempt);
      
      let paymentStatus = 'PENDING';
      if (attempt.status === 'success') {
        paymentStatus = 'SUCCESS';
      } else if (attempt.status === 'failed' || attempt.status === 'cancelled') {
        paymentStatus = 'FAILED';
      }
      
      // If status is still pending, query M-Pesa via SwiftPay proxy
      if (paymentStatus === 'PENDING') {
        console.log(`Status is pending, querying M-Pesa via proxy for ${attempt.checkout_request_id}`);
        try {
          const proxyResponse = await queryMpesaPaymentStatus(attempt.checkout_request_id);
          
          const proxyStatus = proxyResponse?.payment?.status;

          if (proxyResponse && proxyResponse.success && proxyStatus === 'success') {
            console.log(`Proxy confirmed payment success for ${attempt.checkout_request_id}, updating database`);
            
            const { error: updateError } = await appSupabase
              .from('payment_attempts')
              .update({ status: 'success' })
              .eq('checkout_request_id', attempt.checkout_request_id);
            
            if (updateError) {
              console.error('Error updating transaction:', updateError);
            } else {
              paymentStatus = 'SUCCESS';
            }
          } else if (proxyResponse && proxyStatus === 'failed') {
            await appSupabase
              .from('payment_attempts')
              .update({ status: 'failed' })
              .eq('checkout_request_id', attempt.checkout_request_id);
            paymentStatus = 'FAILED';
            console.log(`Proxy confirmed payment failed for ${attempt.checkout_request_id}`);
          } else if (proxyResponse && proxyStatus === 'cancelled') {
            await appSupabase
              .from('payment_attempts')
              .update({ status: 'cancelled' })
              .eq('checkout_request_id', attempt.checkout_request_id);
            paymentStatus = 'FAILED';
          }
        } catch (proxyError) {
          console.error('Error querying M-Pesa via proxy:', proxyError);
          // Continue with local status if proxy query fails
        }
      }
      
      return res.status(200).json({
        success: true,
        payment: {
          status: paymentStatus,
          amount: attempt.amount,
          phoneNumber: attempt.phone_number,
          timestamp: attempt.updated_at
        }
      });
    } else {
      console.log(`Payment status not found for ${reference}, still pending`);
      
      return res.status(200).json({
        success: true,
        payment: {
          status: 'PENDING',
          message: 'Payment is still being processed'
        }
      });
    }
  } catch (error) {
    console.error('Payment status check error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message || String(error)
    });
  }
};
