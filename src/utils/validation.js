export const validatePhone = (phone) => {
    return /^254(7|1)\d{8}$/.test(phone);
  };
  
  export const validateAmount = (amount, provider) => {
    const limits = {
      mpesa: { min: 10, max: 150000 },
      airtel: { min: 5, max: 75000 },
      equitel: { min: 20, max: 200000 }
    };
    return amount >= limits[provider].min && amount <= limits[provider].max;
  };