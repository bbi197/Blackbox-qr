const { client } = require('./paypal-client');

exports.handler = async (event) => {
  try {
    const { orderID } = JSON.parse(event.body);
    
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    
    const capture = await client().execute(request);
    
    return successResponse({
      id: capture.result.id,
      status: capture.result.status,
      email: capture.result.payer.email_address,
      amount: capture.result.purchase_units[0].payments.captures[0].amount.value
    });

  } catch (error) {
    console.error('Capture Error:', error);
    return errorResponse(500, 'Payment capture failed');
  }
};

// Reuse successResponse/errorResponse from previous example
function successResponse(data) {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };
}

function errorResponse(status, message) {
  return {
    statusCode: status,
    body: JSON.stringify({ error: message })
  };
}