export const calculateFees = (amount) => {
    const platformFee = amount * 0.01;
    const businessReceives = amount - platformFee;
    return { platformFee, businessReceives };
  };
  
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };