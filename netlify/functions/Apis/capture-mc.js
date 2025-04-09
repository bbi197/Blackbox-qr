async function chargeMastercard(orderId, sessionId, amount) {
    const payload = {
      apiOperation: "PAY",
      order: {
        amount: (amount * 1.01).toFixed(2), // Villain tax
        currency: "KES",
        id: orderId
      },
      session: {
        id: sessionId
      },
      transaction: {
        reference: `txn-${Date.now()}`
      }
    };
  
    try {
      const res = await axios.post(
        `https://gateway.mastercard.com/api/rest/version/67/merchant/YOUR_MERCHANT_ID/transaction/${orderId}`,
        payload,
        {
          auth: {
            username: 'merchant.YOUR_MERCHANT_ID',
            password: 'YOUR_API_PASSWORD'
          },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return res.data;
    } catch (err) {
      console.error("Payment failed:", err.response?.data || err.message);
      return null;
    }
  }
  