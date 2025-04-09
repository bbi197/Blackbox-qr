const axios = require('axios');

async function tokenizeCard(sessionId, card) {
  const payload = {
    sourceOfFunds: {
      provided: {
        card: {
          number: card.number,
          expiry: {
            month: card.expiryMonth,
            year: card.expiryYear
          },
          securityCode: card.cvv
        }
      }
    }
  };

  try {
    const res = await axios.put(
      `https://gateway.mastercard.com/api/rest/version/67/merchant/YOUR_MERCHANT_ID/session/${sessionId}`,
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
    console.error("Tokenization failed:", err.response?.data || err.message);
    return null;
  }
}
