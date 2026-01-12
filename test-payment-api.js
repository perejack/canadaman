// Test script to verify PayHero API connection
const axios = require('axios');

// PayHero API credentials (from your function)
const API_USERNAME = ' tYWy3Di6vrQyFZbLvBtY';
const API_PASSWORD = 'T5k7IihbPdEs4VOZXvbvSJut3pzbYsgui9YGpNOy';
const CHANNEL_ID = 3603;

// Generate Basic Auth Token
const generateBasicAuthToken = () => {
  const credentials = `${API_USERNAME}:${API_PASSWORD}`;
  return 'Basic ' + Buffer.from(credentials).toString('base64');
};

async function testPayHeroAuth() {
  console.log('Testing PayHero API authentication methods...\n');
  
  const testPhoneNumber = '254700000000';
  const externalReference = `TEST-${Date.now()}`;
  
  const payload = {
    amount: 1,
    phone_number: testPhoneNumber,
    channel_id: CHANNEL_ID,
    provider: "m-pesa",
    external_reference: externalReference,
    description: "API Auth Test",
    callback_url: "/api/payment-callback"
  };
  
  // Test 1: Current Basic Auth method (fixed username)
  console.log('=== Test 1: Basic Auth with fixed credentials ===');
  const authToken = generateBasicAuthToken();
  console.log('Auth Token:', authToken);
  console.log('Username:', API_USERNAME);
  console.log('Password length:', API_PASSWORD.length);
  
  const authHeaders = [
    {
      'Content-Type': 'application/json',
      'Authorization': authToken
    },
    {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_USERNAME}:${API_PASSWORD}`
    },
    {
      'Content-Type': 'application/json',
      'X-API-Key': API_USERNAME,
      'X-API-Secret': API_PASSWORD
    }
  ];
  
  for (let i = 0; i < authHeaders.length; i++) {
    console.log(`\n--- Testing authentication method ${i + 1} ---`);
    console.log('Headers:', JSON.stringify(authHeaders[i], null, 2));
    
    try {
      const response = await axios({
        method: 'post',
        url: 'https://backend.payhero.co.ke/api/v2/payments',
        data: payload,
        headers: authHeaders[i],
        timeout: 10000
      });
      
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(response.data, null, 2));
      
      if (response.status === 401) {
        console.log('❌ 401 Unauthorized - Authentication failed');
      } else if (response.status === 200 || response.status === 201) {
        console.log('✅ SUCCESS: Authentication working!');
        break;
      }
    } catch (error) {
      console.log('Error:', error.message);
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
  
  // Test 2: Try different API endpoint
  console.log('\n=== Test 2: Try different endpoint ===');
  try {
    const response = await axios({
      method: 'post',
      url: 'https://backend.payhero.co.ke/api/v1/payments',
      data: payload,
      headers: authHeaders[0], // Use first auth method
      timeout: 10000
    });
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
console.log('='.repeat(50));
console.log('PayHero API Connection Test');
console.log('='.repeat(50));
console.log('\n');

testPayHeroAuth().then(() => {
  console.log('\n' + '='.repeat(50));
  console.log('Test completed');
  console.log('='.repeat(50));
}).catch(err => {
  console.error('Unexpected error:', err);
});
