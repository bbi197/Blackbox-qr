const { client } = require('./paypal-client');

exports.handler = async (event) => {
  try {
    const { amount, currency = 'USD' } = JSON.parse(event.body);
    
    // Validate amount
    if (!amount || isNaN(amount)) {
      return errorResponse(400, 'Invalid amount');
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: amount,
          breakdown: {
            item_total: {
              currency_code: currency,
              value: amount
            },
            handling: {
              currency_code: currency,
              value: "0.00"
            }
          }
        }
      }]
    });

    const order = await client().execute(request);
    
    return successResponse({
      id: order.result.id,
      status: order.result.status,
      links: order.result.links
    });

  } catch (error) {
    console.error('PayPal Error:', error);
    return errorResponse(500, 'Payment processing failed');
  }
};

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