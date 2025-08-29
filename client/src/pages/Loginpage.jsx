import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../assets/Logo';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
    } finally { setLoading(false); }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 font-sans">
      <div className="w-full max-w-md p-8 pt-12 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
            <Logo className="mx-auto h-10 w-auto text-indigo-600"/>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Excel Analytics
            </h2>
            <p className="mt-2 text-sm text-gray-600">Transform your data into insights</p>
        </div>
        
        {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
              required 
              disabled={loading}
              placeholder="user@demo.com or admin@demo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
              required 
              disabled={loading}
              placeholder="demo123 or admin123"
            />
          </div>
          
          {/* This is the new section that adds the link */}
          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-indigo-600 hover:underline">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition duration-150"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline transition duration-150">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;