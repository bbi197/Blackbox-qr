import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPage from './AdminPage';
import PaymentPage from './PaymentPage';

export default function IndexPage() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/pay" element={<PaymentPage />} />
          <Route path="*" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
}