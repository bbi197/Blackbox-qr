import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';

function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/pay" element={<PaymentPage />} />
      <Route path="*" element={<PaymentPage />} />
    </Routes>
  );
}