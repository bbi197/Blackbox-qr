// netlify/functions/airtel-b2c-payment.js

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // --- Simulate Authentication Check ---
  const authHeader = event.headers.authorization;
  const expectedTokenPrefix = 'Bearer mock-airtel-token-'; // Should match token from oauth mock

  if (!authHeader || !authHeader.startsWith(expectedTokenPrefix)) {
     return {
       statusCode: 401,
       headers: { 'Content-Type': 'application/json' },
       // Simulate an Airtel-like error structure
       body: JSON.stringify({
           status: { success: false, response_code: 'AUTH-401', message: 'Unauthorized' }
       })
     };
  }
  // --- End Authentication Check ---

  const body = JSON.parse(event.body || '{}');

  // --- Simulate Basic Input Validation ---
  if (!body.recipient_msisdn || !body.amount || !body.transaction_id) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         status: { success: false, response_code: 'VALIDATE-001', message: 'Bad Request: Missing parameters' }
      })
    };
  }
  // --- End Validation ---


  // --- Simulate Success Response ---
  const mockSuccessResponse = {
    status: {
      success: true,
      response_code: "B2C-000", // Example success code
      message: "B2C request accepted successfully."
    },
    data: {
      transaction_id: body.transaction_id, // Echo back the transaction ID
      conversation_id: "AIRTEL_CONV_" + Date.now(), // Generate a unique mock ID
      response_description: "Request accepted for processing"
    }
  };

  // You could add logic to sometimes return errors based on input (e.g., specific amounts/numbers)
  // if (body.amount > 1000) { /* return insufficient funds error */ }

  return {
    statusCode: 200, // Or 202 if the real API is asynchronous
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mockSuccessResponse)
  };
};
// netlify/functions/airtel-transaction-status.js

exports.handler = async (event, context) => {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // --- Simulate Authentication Check ---
  const authHeader = event.headers.authorization;
  const expectedTokenPrefix = 'Bearer mock-airtel-token-';

  if (!authHeader || !authHeader.startsWith(expectedTokenPrefix)) {
     return {
       statusCode: 401,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status: { success: false, response_code: 'AUTH-401', message: 'Unauthorized' } })
     };
  }
  // --- End Authentication Check ---

  // Get transaction ID from query parameters (?id=...)
  const transactionId = event.queryStringParameters.id;

  if (!transactionId) {
     return {
       statusCode: 400,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status: { success: false, response_code: 'QUERY-001', message: 'Missing transaction ID' } })
     };
  }

  // --- Simulate Different Statuses Based on ID ---
  let mockStatusResponse;
  if (transactionId.includes('success')) {
      mockStatusResponse = {
          status: { success: true, response_code: 'STATUS-000', message: 'Transaction Successful' },
          data: { transaction_id: transactionId, status: 'Completed', amount: 50.00, msisdn: '254733xxxxxx', date: new Date().toISOString() }
      };
  } else if (transactionId.includes('failed')) {
      mockStatusResponse = {
          status: { success: false, response_code: 'STATUS-005', message: 'Transaction Failed' },
          data: { transaction_id: transactionId, status: 'Failed', reason: 'Insufficient Funds', date: new Date().toISOString() }
      };
  } else {
      mockStatusResponse = {
          status: { success: true, response_code: 'STATUS-001', message: 'Transaction Pending' },
          data: { transaction_id: transactionId, status: 'Pending', date: new Date().toISOString() }
      };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(mockStatusResponse)
  };
};