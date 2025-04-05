import AdminDashboard from '../components/admin/Dashboard';

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 mb-4">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </header>
      <main className="px-6">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default AdminPage;
