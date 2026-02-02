import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dbpbvoqfexofyxcexmmp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRicGJ2b3FmZXhvZnl4Y2V4bW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzNDc0NTMsImV4cCI6MjA3NDkyMzQ1M30.hGn7ux2xnRxseYCjiZfCLchgOEwIlIAUkdS6h7byZqc'

const supabase = createClient(supabaseUrl, supabaseKey);

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

    if (!payload.TransactionID) {
      console.error('Invalid webhook: Missing TransactionID');
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

    let transaction = null;

    if (TransactionReference) {
      const result = await supabase
        .from('transactions')
        .select('*')
        .eq('reference', TransactionReference)
        .maybeSingle();
      transaction = result.data;
    }

    if (!transaction && Msisdn) {
      const result = await supabase
        .from('transactions')
        .select('*')
        .eq('phone', Msisdn)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      transaction = result.data;
    }

    if (transaction) {
      console.log('Found transaction to update:', transaction.id);

      const { error: updateError } = await supabase
        .from('transactions')
        .update({
          status: status,
          result_code: ResponseCode.toString(),
          result_description: statusMessage,
          receipt_number: TransactionReceipt !== 'N/A' ? TransactionReceipt : null,
          merchant_request_id: MerchantRequestID,
          checkout_request_id: CheckoutRequestID,
          transaction_date: parsedDate,
          transaction_id: TransactionID,
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error('Database update error:', updateError);
      } else {
        console.log('Transaction updated successfully:', TransactionID, 'Status:', status);
      }
    } else {
      console.error('Transaction not found for webhook');
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
