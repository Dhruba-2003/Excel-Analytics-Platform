import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { FiFileText } from 'react-icons/fi';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || !userInfo.token) {
          throw new Error('You must be logged in to view history.');
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/files', config);
        setHistory(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="flex h-screen bg-base-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-base-100 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-semibold text-text-primary">Upload History</h1>
            <p className="mt-2 text-text-secondary">Here is a list of all the files you have uploaded.</p>
            
            {loading ? (
              <p className="mt-8">Loading history...</p>
            ) : error ? (
              <p className="mt-8 text-red-500 bg-red-100 p-4 rounded-md">{error}</p>
            ) : (
              <div className="mt-8 bg-content-bg rounded-xl shadow-md">
                <ul className="divide-y divide-gray-200">
                  {history.length > 0 ? (
                    history.map(file => (
                      <li key={file._id}>
                        {/* In a full app, this link would go to a page to re-analyze this file */}
                        <Link to={`/`} className="block p-4 hover:bg-gray-50">
                          <div className="flex items-center space-x-4">
                            <FiFileText className="h-6 w-6 text-primary"/>
                            <div className="flex-1">
                                <p className="font-semibold text-primary">{file.fileName}</p>
                                <p className="text-sm text-text-secondary">
                                  Uploaded on: {new Date(file.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className="text-sm text-text-secondary">{file.data.length} rows</span>
                          </div>
                        </Link>
                      </li>
                    ))
                  ) : (
                    <p className="p-4 text-text-secondary">No upload history found.</p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;