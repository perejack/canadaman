import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey);

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
    
    const { data: transaction, error: dbError } = await supabase
      .from('transactions')
      .select('*')
      .or(`reference.eq.${reference},transaction_request_id.eq.${reference}`)
      .maybeSingle();
    
    if (dbError) {
      console.error('Database query error:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Error checking payment status',
        error: dbError.message || String(dbError)
      });
    }
    
    if (transaction) {
      console.log(`Payment status found for ${reference}:`, transaction);
      
      let paymentStatus = 'PENDING';
      if (transaction.status === 'success') {
        paymentStatus = 'SUCCESS';
      } else if (transaction.status === 'failed' || transaction.status === 'cancelled') {
        paymentStatus = 'FAILED';
      }
      
      // If status is still pending, query M-Pesa via SwiftPay proxy
      if (paymentStatus === 'PENDING') {
        console.log(`Status is pending, querying M-Pesa via proxy for ${transaction.transaction_request_id}`);
        try {
          const proxyResponse = await queryMpesaPaymentStatus(transaction.transaction_request_id);
          
          if (proxyResponse && proxyResponse.success && proxyResponse.payment.status === 'success') {
            console.log(`Proxy confirmed payment success for ${transaction.transaction_request_id}, updating database`);
            
            // Update transaction to success
            const { data: updatedTransaction, error: updateError } = await supabase
              .from('transactions')
              .update({
                status: 'success'
              })
              .eq('id', transaction.id)
              .select();
            
            if (!updateError && updatedTransaction && updatedTransaction.length > 0) {
              paymentStatus = 'SUCCESS';
              console.log(`Transaction ${transaction.transaction_request_id} updated to success:`, updatedTransaction[0]);
            } else if (updateError) {
              console.error('Error updating transaction:', updateError);
            }
          } else if (proxyResponse && proxyResponse.payment.status === 'failed') {
            paymentStatus = 'FAILED';
            console.log(`Proxy confirmed payment failed for ${transaction.transaction_request_id}`);
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
          amount: transaction.amount,
          phoneNumber: transaction.phone,
          mpesaReceiptNumber: transaction.receipt_number,
          resultDesc: transaction.result_description,
          resultCode: transaction.result_code,
          timestamp: transaction.updated_at
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
