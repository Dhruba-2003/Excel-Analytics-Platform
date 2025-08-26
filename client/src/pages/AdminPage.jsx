import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
            throw new Error('You must be logged in as an admin.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get('/api/admin/users', config);
        setUsers(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users. You may not have admin privileges.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen bg-base-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-base-100 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-text-primary">Admin Panel - User Management</h1>
            
            {loading ? (
              <p className="mt-4">Loading users...</p>
            ) : error ? (
              <p className="mt-4 text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            ) : (
              <div className="mt-8 bg-content-bg rounded-xl shadow-md overflow-x-auto">
                 <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-base-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase">Is Admin</th>
                        </tr>
                    </thead>
                    <tbody className="bg-content-bg divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">{user._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    {user.isAdmin 
                                        ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                                        : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;