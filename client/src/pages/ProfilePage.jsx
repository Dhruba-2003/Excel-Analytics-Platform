import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/users/profile', config);
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const updateData = { name, email };
        if (password) {
          updateData.password = password;
        }

        const { data } = await axios.put('/api/users/profile', updateData, config);
        
        localStorage.setItem('userInfo', JSON.stringify(data));
        setSuccess('Profile updated successfully!');
        setPassword('');
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to update profile');
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
            <h1 className="text-3xl font-semibold text-text-primary">User Profile</h1>
            <div className="mt-6 p-6 bg-content-bg rounded-xl shadow-md">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
                {success && <p className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
                <div>
                  <label className="block text-sm font-medium text-text-primary">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required disabled={loading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" required disabled={loading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary">New Password (leave blank to keep current password)</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm" disabled={loading} />
                </div>
                <div>
                  <button type="submit" className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary-hover disabled:bg-blue-300 transition" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;