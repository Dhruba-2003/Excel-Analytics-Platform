import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const UserEditPage = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/admin/users/${userId}`, config);
        setName(data.name);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
      } catch (err) {
        setError('Failed to fetch user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`/api/admin/users/${userId}`, { name, email, isAdmin }, config);
      setSuccess('User updated successfully!');
      setTimeout(() => navigate('/admin'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-base-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-base-100 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-text-primary">Edit User</h1>
            {loading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
              <div className="mt-6 p-6 bg-content-bg rounded-xl shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {success && <p className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
                  <div>
                    <label className="block text-sm font-medium text-text-primary">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required />
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="isAdmin" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="h-4 w-4 text-primary border-gray-300 rounded"/>
                    <label htmlFor="isAdmin" className="ml-2 block text-sm text-text-primary">Is Admin</label>
                  </div>
                  <div>
                    <button type="submit" className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-hover disabled:bg-blue-300 transition" disabled={loading}>
                      {loading ? 'Updating...' : 'Update User'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserEditPage;