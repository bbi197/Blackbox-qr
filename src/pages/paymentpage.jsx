import React, { useEffect, useState } from 'react';
import QRScanner from '../components/QRScanner';
import PaymentForm from '../components/PaymentForm';
import TransactionFeedback from '../components/TransactionFeedback';
import usePaymentGateway from '../hooks/usePayment';

const PaymentPage = () => {
  const {
    processPayment,
    validationErrors,
    transactionStatus,
    handleScan,
    setBusinessId,
    loadingBusiness,
    businessInfo
  } = usePaymentGateway();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-center">QR Code Payment</h1>

      <QRScanner onScan={handleScan} />

      {loadingBusiness ? (
        <p className="text-center">Loading business info...</p>
      ) : (
        businessInfo && (
          <div className="bg-gray-100 p-4 rounded">
            <p className="text-sm">Business: <strong>{businessInfo.name}</strong></p>
            <p className="text-sm">Provider(s): {businessInfo.payment_config.allowed_providers.join(', ')}</p>
          </div>
        )
      )}

      <PaymentForm
        onSubmit={processPayment}
        providerOptions={businessInfo?.payment_config.allowed_providers || []}
      />

      <TransactionFeedback
        status={transactionStatus}
        errors={validationErrors}
      />
    </div>
  );
};

export default PaymentPage;
