import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const { data } = await axios.post('/api/users/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-100 font-sans">
            <div className="w-full max-w-md p-8 space-y-6 bg-content-bg rounded-2xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-text-primary">Forgot Password</h2>
                    <p className="mt-2 text-sm text-text-secondary">Enter your email and we'll send you a reset link.</p>
                </div>

                {message && <p className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-md">{message}</p>}
                {error && <p className="text-sm text-center text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-text-primary">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md" required disabled={loading}/>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 text-sm font-medium text-white bg-primary hover:bg-primary-hover rounded-md" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>
                 <p className="text-sm text-center text-gray-600">
                    Remember your password?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;