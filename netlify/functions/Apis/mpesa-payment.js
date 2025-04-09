const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  try {
    // Get access token first
    const authResponse = await fetch('/.netlify/functions/mpesa-auth');
    const authData = await authResponse.json();
    
    if (!authResponse.ok) {
      throw new Error('Failed to get access token');
    }

    // Parse payment data
    const { phone, amount, bizId } = JSON.parse(event.body);
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, -3);
    
    // M-Pesa STK Push parameters
    const payload = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: Buffer.from(
        `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
      ).toString('base64'),
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: `254${phone.slice(-9)}`, // Ensure proper format
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: `254${phone.slice(-9)}`,
      CallBackURL: `${process.env.URL}/.netlify/functions/mpesa-callback`,
      AccountReference: bizId,
      TransactionDesc: 'Payment to ' + bizId,
      Timestamp: timestamp,
      //CheckoutRequestID: `Req-${uuidv4()}`
    };

    // Process payment
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Payment failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        transactionId: result.CheckoutRequestID,
        message: "Payment request sent to M-PESA",
        redirectUrl: result.CustomerMessage
      })
    };

  } catch (error) {
    console.error('Payment Error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        error: error.message,
        code: 'PAYMENT_FAILED'
      })
    };
  }
};