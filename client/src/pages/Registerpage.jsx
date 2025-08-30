import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await axios.post('/api/users/register', { name, email, password });
    
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      console.log('User registered and logged in successfully:', data);
    
      navigate('/');

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
      setError(errorMessage);
      console.error('Registration error:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-content-bg rounded-2xl shadow-lg">
        <h2 className="mt-6 text-3xl font-bold text-center text-text-primary">Create a New Account</h2>
        
        {error && <p className="text-sm text-center text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text-primary">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required 
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required 
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
              required 
              disabled={loading}
            />
          </div>
          <div>
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-text-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;