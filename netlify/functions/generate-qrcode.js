const QRCode = require('qrcode');

exports.handler = async (event) => {
  const { bizId, businessName } = JSON.parse(event.body);
  const qrData = JSON.stringify({ 
    bizId,
    name: businessName,
    type: 'payment'
  });

  const url = await QRCode.toDataURL(qrData);
  return {
    statusCode: 200,
    body: JSON.stringify({ url })
  };
};