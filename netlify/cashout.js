// netlify/functions/cashout.js (runs hourly)
export default async () => {
    const balance = await checkWalletBalance();
    if(balance > 1000) { // KES 1000 threshold
      await transferToOffshore(balance);
      await purgeLogs();
    }
  };