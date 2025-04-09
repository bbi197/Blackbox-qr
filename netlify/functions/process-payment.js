const { v4: uuidv4 } = require('uuid');
const admin = require('firebase-admin');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(require('./service-account.json')),
  databaseURL: 'your-firebase-db-url'
});
const db = admin.firestore();

exports.handler = async (event) => {
  // Extract parameters with safety checks
  const { method, amount, phone, bizId, cardDetails, account } = JSON.parse(event.body || '{}');

  // Validate input parameters
  if (!['mpesa', 'airtel', 'paypal', 'visa', 'equitel', 'KCBmpesa', 'mastercard'].includes(method)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid payment method" }) };
  if (typeof amount !== 'number' || amount <= 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid amount" }) };
  }

  try {
    // Firestore transaction handler
    return await db.runTransaction(async (transaction) => {
      // Get business document
      const bizRef = db.collection('businesses').doc(bizId);
      const bizDoc = await transaction.get(bizRef);
      
      if (!bizDoc.exists) {
        throw new Error('Business not found');
      }

      // Process payment
      let paymentResult;
      switch(method.toLowerCase()) { // Case-insensitive matching
        case 'mpesa':
          paymentResult = await processMpesa(phone, amount);
          break;
        case 'equitel':
          paymentResult = await processEquitel(phone, amount);
          break;
        case 'kcbmpesa': // Standardized case
          if (!account) throw new Error('Account number required');
          paymentResult = await processKcbmpesa(phone, account, amount);
          break;
        case 'airtel':
          paymentResult = await processAirtel(phone, amount);
          break;
        case 'paypal':
          paymentResult = await processPaypal(amount);
          break;
        case 'visa':
          paymentResult = await processVisa(cardDetails, amount);
          break;
        case 'mastercard':
          paymentResult = await processMastercard(cardDetails, amount);
          break;
        default:
          throw new Error('Unsupported payment method');
      }

      // Calculate fees and amounts
      const platformFee = Number((amount * 0.01).toFixed(2));
      const netAmount = Number((amount - platformFee).toFixed(2));

      // Update business record
      transaction.update(bizRef, {
        balance: admin.firestore.FieldValue.increment(netAmount),
        transactions: admin.firestore.FieldValue.arrayUnion({
          id: uuidv4(),
          amount: netAmount,
          method: method.toLowerCase(),
          date: admin.firestore.FieldValue.serverTimestamp(),
          status: 'completed'
        })
      });

      // Update platform balance
      const platformRef = db.collection('platform').doc('balance');
      transaction.update(platformRef, {
        total: admin.firestore.FieldValue.increment(platformFee),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
      });

      return {
        statusCode: 200,
        body: JSON.stringify({
          ...paymentResult,
          netAmount,
          platformFee,
          transactionDate: new Date().toISOString()
        })
      };
    });

  } catch (error) {
    console.error(`Payment Error [${method}]:`, error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        error: error.message,
        method,
        amount,
        timestamp: new Date().toISOString()
      })
    };
  }
};
}
// ======================
// Payment Processors
// ======================

async function processEquitel(phone, amount) {
  // Implement Equitel API integration
  return {
    success: true,
    transactionId: uuidv4(),
    message: "Equitel payment processed",
    amount
  };
}

async function processKcbmpesa(phone, account, amount) {
  // Implement KCBMpesa API logic
  if (!/^[0-9]{10}$/.test(account)) {
    throw new Error('Invalid account number format');
  }
  return {
    success: true,
    transactionId: uuidv4(),
    message: "KCB M-Pesa payment processed",
    amount
  };
}

async function processMastercard(card, amount) {
  // Basic card validation
  const isValid = /^5[1-5][0-9]{14}$/.test(card.number);
  if (!isValid) throw new Error('Invalid Mastercard');
  
  return {
    success: true,
    transactionId: uuidv4(),
    message: "Mastercard payment processed",
    amount
  };
}

// Existing processors (Visa, PayPal, etc.) remain same