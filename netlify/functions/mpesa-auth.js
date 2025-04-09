const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    // Get credentials from environment variables
    const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
    const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
    
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      throw new Error('M-Pesa credentials not configured');
    }

    // Create Basic Auth token
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    
    // Request access token
    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'no-store',
        'Pragma': 'no-cache'
      },
      body: JSON.stringify({
        access_token: data.access_token,
        expires_in: data.expires_in
      })
    };

  } catch (error) {
    console.error('Auth Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};