const { v4: uuidv4 } = require('uuid');

// Mock DB – replace with persistent DB later
let businessState = {
  businesses: [
    { id: 'biz_001', name: "Sample Business", balance: 0, transactions: [] }
  ],
  platformBalance: 0
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const stkCallback = body.Body.stkCallback;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;
    const amount = parseInt(
      stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'Amount')?.Value || 0
    );
    const phone = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'PhoneNumber')?.Value;
    const transactionId = stkCallback.CheckoutRequestID;
    const bizId = stkCallback.CallbackMetadata?.Item?.find(i => i.Name === 'AccountReference')?.Value;

    if (resultCode !== 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: resultDesc })
      };
    }

    const platformFee = Math.ceil(amount * 0.01);
    const netAmount = amount - platformFee;

    // Update business state
    const business = businessState.businesses.find(b => b.id === bizId);
    if (!business) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Business not found in callback" })
      };
    }

    business.balance += netAmount;
    business.transactions.push({
      id: uuidv4(),
      amount: netAmount,
      phone,
      rawAmount: amount,
      transactionId,
      platformFee,
      date: new Date().toISOString()
    });

    businessState.platformBalance += platformFee;

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Callback processed",
        bizId,
        netAmount,
        platformFee
      })
    };

  } catch (error) {
    console.error('Callback error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
