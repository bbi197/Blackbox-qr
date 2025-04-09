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
  // Updated JavaScript
let currentBusinessState = null;
let scannedBizId = null;

// Modified processQRCode function
function processQRCode(qrData) {
  try {
    const { bizId, name } = JSON.parse(qrData);
    scannedBizId = bizId;
    
    document.getElementById("business-name").textContent = name;
    document.getElementById("business-id").textContent = bizId;
    document.getElementById("payment-section").classList.remove("hidden");
    
    // Fetch current business state
    fetchBusinessState(bizId);
  } catch (e) {
    alert("Invalid QR Code");
    resetForm();
  }
}

async function fetchBusinessState(bizId) {
  try {
    const response = await fetch('/.netlify/functions/get-business-state', {
      method: 'POST',
      body: JSON.stringify({ bizId })
    });
    currentBusinessState = await response.json();
  } catch (error) {
    console.error('Error fetching state:', error);
  }
}

document.getElementById('payment-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const amount = parseFloat(document.getElementById('amount').value);
  const phone = document.getElementById('phone').value;
  const method = document.getElementById('payment-method').value;

  if (!validateInputs(amount, phone)) return;

  try {
    // Initiate payment with provider
    const paymentResult = await processPayment(method, amount, phone);
    
    // Update business state
    const updatedState = await updateBusinessState(amount, phone);
    
    handlePaymentSuccess(updatedState);
  } catch (error) {
    handlePaymentError(error);
  }
});

async function processPayment(method, amount, phone) {
  const endpoints = {
    mpesa: '/.netlify/functions/mpesa-payment',
    airtel: '/.netlify/functions/airtel-payment',
    paypal: '/.netlify/functions/paypal-checkout'
  };

  const response = await fetch(endpoints[method], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount,
      phone,
      bizId: scannedBizId
    })
  });

  return response.json();
}

async function updateBusinessState(amount, phone) {
  const response = await fetch('/.netlify/functions/update-business-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentState: currentBusinessState,
      bizId: scannedBizId,
      amount,
      phone
    })
  });

  return response.json();
}

function validateInputs(amount, phone) {
  if (isNaN(amount) || amount <= 0) {
    alert("Invalid amount");
    return false;
  }
  if (!phone.match(/^\+?[0-9]{10,14}$/)) {
    alert("Invalid phone number");
    return false;
  }
  return true;
}

function handlePaymentSuccess(updatedState) {
  currentBusinessState = updatedState;
  document.getElementById('payment-status').classList.remove('hidden');
  document.getElementById('payment-status').innerHTML = `
    <p>Payment successful!</p>
    <p>New balance: ${updatedState.businesses.find(b => b.id === scannedBizId).balance} KES</p>
  `;
}

function handlePaymentError(error) {
  console.error('Payment error:', error);
  document.getElementById('payment-status').classList.remove('hidden');
  document.getElementById('payment-status').textContent = 
    `Payment failed: ${error.message || 'Unknown error'}`;
}

// Keep existing QR scanning logic