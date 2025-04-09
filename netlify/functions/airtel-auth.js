// netlify/functions/airtel-oauth-token.js

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
  
    // You could optionally check for mock client_id/secret in event.body here
    // const body = JSON.parse(event.body || '{}');
    // if(body.client_id !== 'YOUR_MOCK_ID') { /* reject */ }
  
    const mockTokenResponse = {
      access_token: 'mock-airtel-token-' + Math.random().toString(36).substring(7),
      token_type: 'Bearer',
      expires_in: 3599 // Simulate 1 hour expiry
    };
  
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockTokenResponse)
    };
  };