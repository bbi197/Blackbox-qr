import { useState } from 'react';
import axios from 'axios';

export default function QRCodeGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    ownerPhone: '',
    commissionRate: 1.0
  });
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Register business
      const regRes = await axios.post('/.netlify/functions/register-business', formData);
      
      // 2. Generate QR code
      const qrRes = await axios.post('/.netlify/functions/generate-qr', {
        bizId: regRes.data.bizId
      });

      setQrImage(qrRes.data.url);
    } catch (error) {
      console.error('Registration failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="qr-generator p-5 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Register New Business</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Business Name</label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-1">Owner Phone</label>
          <input
            type="tel"
            pattern="^2547\d{8}$"
            required
            className="w-full p-2 border rounded"
            value={formData.ownerPhone}
            onChange={(e) => setFormData({...formData, ownerPhone: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Generate QR Code'}
        </button>
      </form>

      {qrImage && (
        <div className="mt-6">
          <h4 className="mb-2 font-medium">Generated QR Code</h4>
          <img src={qrImage} alt="Business QR Code" className="border p-2 rounded" />
          <a
            href={qrImage}
            download="qrcode.png"
            className="mt-2 inline-block text-blue-600 hover:underline"
          >
            Download PNG
          </a>
        </div>
      )}
    </div>
  );
}
