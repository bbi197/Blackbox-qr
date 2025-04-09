// validateCard.js
const axios = require('axios');
const https = require('https');
const fs = require('fs');

const visaAuth = {
  username: 'YOUR_API_USERNAME',
  password: 'YOUR_API_PASSWORD'
};

const httpsAgent = new https.Agent({
  cert: fs.readFileSync('./cert.pem'),
  key: fs.readFileSync('./key.pem'),
  ca: fs.readFileSync('./cacert.pem')
});

async function validateCard(primaryAccountNumber, expDate, cvv) {
  const payload = {
    primaryAccountNumber,
    cardCvv2Value: cvv,
    cardExpiryDate: expDate,
    addressVerificationData: {
      postalCode: "00100",
      street: "Nairobi"
    }
  };

  try {
    const res = await axios.post(
      'https://sandbox.api.visa.com/pav/v1/cardvalidation',
      payload,
      {
        httpsAgent,
        auth: visaAuth,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    return res.data;
  } catch (err) {
    console.error("Card validation failed:", err.response?.data || err.message);
    return null;
  }
}
