// src/utils/mockDB.js
let businesses = [
  {
    id: 'BIZ-SAMPLE-01',
    name: 'Sample Business',
    commissionRate: 2.5,
    balance: 0,
    transactions: []
  }
];

let transactions = [];
let platformAccount = { balance: 0 };

export const mockDB = {
  // Business operations
  addBusiness: (biz) => businesses.push(biz),
  getBusiness: (id) => businesses.find(b => b.id === id),
  getAllBusinesses: () => businesses,
  
  // Transaction handling
  addTransaction: (tx) => {
    transactions.push(tx);
    const business = businesses.find(b => b.id === tx.bizId);
    if (business) business.transactions.push(tx);
  },
  getTransactions: () => transactions,
  
  // Platform earnings
  getPlatformBalance: () => platformAccount.balance,
  addPlatformFee: (amount) => platformAccount.balance += amount
};