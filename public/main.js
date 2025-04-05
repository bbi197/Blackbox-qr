// public/main.js
const sanitizeAmount = (userInput) => {
    const amount = parseFloat(userInput);
    const fee = Math.ceil(amount * 0.01);
    return {
      display: `${amount} + ${fee} (Service Charge)`, 
      actual: amount + fee,
      fee
    };
  };