// Quick local test: submit application -> initiate payment -> check status
// Run with: node test-local-payment-flow.js
// Default assumes your dev server is running on http://localhost:8080
// Override with: BASE_URL=http://localhost:3000 node test-local-payment-flow.js

const BASE = process.env.BASE_URL || 'http://localhost:8080';

async function run() {
  const phone = '254712345678'; // Change to a real number for actual STK
  const userId = 'test-user-123';

  console.log('=== Step 1: Submit Application ===');
  const submitRes = await fetch(`${BASE}/api/submit-application`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, userId })
  });
  const submit = await submitRes.json();
  console.log('Submit response:', submit);
  if (!submit.success) {
    console.error('Submit failed, aborting');
    return;
  }
  const { applicationId, reference } = submit.data;

  console.log('\n=== Step 2: Initiate Payment ===');
  const payRes = await fetch(`${BASE}/api/initiate-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phoneNumber: phone,
      amount: 250,
      description: 'Application Fee',
      applicationId,
      purpose: 'application'
    })
  });
  const pay = await payRes.json();
  console.log('Payment response:', pay);
  if (!pay.success) {
    console.error('Payment initiation failed');
    return;
  }
  const checkoutId = pay.data.requestId;

  console.log('\n=== Step 3: Check Payment Status (poll) ===');
  let attempts = 0;
  const maxAttempts = 12;
  const interval = 10000; // 10 seconds

  async function checkStatus() {
    const statusRes = await fetch(`${BASE}/api/payment-status?reference=${checkoutId}`);
    const status = await statusRes.json();
    console.log(`[${attempts+1}/${maxAttempts}] Status:`, status);
    if (status.payment?.status === 'SUCCESS' || status.payment?.status === 'FAILED') {
      console.log('✅ Final status reached:', status.payment.status);
      process.exit(0);
    }
    if (++attempts >= maxAttempts) {
      console.log('⏱️ Timeout: payment still pending after max attempts');
      process.exit(0);
    }
    setTimeout(checkStatus, interval);
  }
  setTimeout(checkStatus, 3000); // first check after 3s
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
