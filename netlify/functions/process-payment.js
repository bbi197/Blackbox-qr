const { v4: uuidv4 } = require('uuid');

exports.handler = async (event) => {
  const { currentState, bizId, amount, phone } = JSON.parse(event.body);
  
  // Calculate fees
  const platformFee = amount * 0.01;
  const business = currentState.businesses.find(b => b.id === bizId);
  
  if (!business) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Business not found' }) };
  }

  // Update state
  const updatedState = {
    ...currentState,
    businesses: currentState.businesses.map(b => 
      b.id === bizId ? { 
        ...b, 
        balance: b.balance + (amount - platformFee),
        transactions: [...b.transactions, { amount, phone, timestamp: Date.now() }]
      } : b
    ),
    platformBalance: currentState.platformBalance + platformFee
  };

  return {
    statusCode: 200,
    body: JSON.stringify(updatedState)
  };
};