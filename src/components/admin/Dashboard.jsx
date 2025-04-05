import { useMockDB } from '../../hooks/useMockDB';

const AdminDashboard = () => {
  const [state, updateState] = useMockDB();
  
  const addBusiness = async (name) => {
    const response = await axios.post('/.netlify/functions/add-business', {
      currentState: state,
      name
    });
    updateState(response.data);
  };

  return (
    <div>
      {/* Business list and controls */}
      <BusinessList businesses={state.businesses} />
      <PlatformEarnings balance={state.platformBalance} />
    </div>
  );
};