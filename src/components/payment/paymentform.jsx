import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function PaymentForm({ bizId }) {
  const [formState, setFormState] = useState({
    amount: '',
    phone: '',
    isSubmitting: false,
    feedback: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const response = await axios.post('/.netlify/functions/process-payment', {
        bizId,
        amount: parseFloat(formState.amount),
        phone: formState.phone
      });

      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        feedback: {
          type: 'success',
          message: `Payment of KES ${formState.amount} successful!`
        }
      }));
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        feedback: {
          type: 'error',
          message: error.response?.data?.error || 'Payment failed'
        }
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="form-group">
        <label>Amount (KES)</label>
        <input
          type="number"
          value={formState.amount}
          onChange={(e) => setFormState(prev => ({
            ...prev,
            amount: e.target.value
          }))}
          required
          min="10"
          step="1"
        />
      </div>

      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          pattern="^2547\d{8}$"
          value={formState.phone}
          onChange={(e) => setFormState(prev => ({
            ...prev,
            phone: e.target.value
          }))}
          required
        />
      </div>

      <motion.button
        type="submit"
        disabled={formState.isSubmitting}
        whileTap={{ scale: 0.95 }}
        className="submit-btn"
      >
        {formState.isSubmitting ? 'Processing...' : 'Confirm Payment'}
      </motion.button>

      {formState.feedback && (
        <div className={`feedback ${formState.feedback.type}`}>
          {formState.feedback.message}
        </div>
      )}
    </form>
  );
}