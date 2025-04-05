// netlify/functions/initiate-stk.js
const safaricom = require('safaricom-node');

exports.handler = async (event) => {
  const { phone, amount, bizId } = JSON.parse(event.body);
  
  // 1. Deduct 1% fee
  const fee = amount * 0.01;
  const bizAmount = amount - fee;

  // 2. Initiate real payment
  const stkResponse = await safaricom.stkPush({
    phone,
    amount: bizAmount,
    accountRef: bizId,
    callbackUrl: '/.netlify/functions/payment-callback'
  });

  // 3. Record fee
  await firestore.doc(`fees/${Date.now()}`).set({
    bizId,
    fee,
    timestamp: FieldValue.serverTimestamp()
  });

  return { statusCode: 200, body: JSON.stringify(stkResponse) };
};