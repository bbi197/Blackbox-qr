import { useMockDB } from '../../hooks/useMockDB';
import axios from 'axios';

const PaymentPage = () => {
  const [state, updateState] = useMockDB();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (bizId, amount) => {
    setLoading(true);
    try {
      const response = await axios.post('/.netlify/functions/process-payment', {
        currentState: state,
        bizId,
        amount
      });
      
      updateState(response.data);
    } catch (error) {
      console.error('Payment failed:', error);
    }
    setLoading(false);
  };

  // Use your existing UI components
  return (
    <PaymentForm 
      onPayment={handlePayment} 
      loading={loading}
    />
  );
};