import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiFileText, FiBarChart2, FiSearch } from 'react-icons/fi';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const query = useQuery();
  const searchQuery = query.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { 
            headers: { Authorization: `Bearer ${userInfo.token}` },
            params: { search: searchQuery }
        };
        const { data } = await axios.get('/api/files', config);
        setHistory(data);
      } catch (err) {
        setError('Failed to fetch history.');
      } finally { setLoading(false); }
    };
    fetchHistory();
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/history?search=${searchTerm}`);
  };

  return (
    <div className="flex h-screen bg-base-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-base-100 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary">Upload & Analysis History</h1>
                <p className="mt-2 text-text-secondary">Click on a file to view and re-analyze it.</p>
              </div>
              <form onSubmit={handleSearch} className="relative">
                  <FiSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"/>
                  <input 
                      type="text"
                      placeholder="Search by filename..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-primary focus:border-primary"
                  />
              </form>
            </div>
            
            {loading ? <p className="mt-8 text-center">Loading history...</p> : error ? <p className="mt-8 text-red-500 text-center">{error}</p> : (
              <div className="mt-8 space-y-6">
                {history.length > 0 ? (
                  history.map(file => (
                    <Link to={`/dashboard/${file._id}`} key={file._id} className="block bg-content-bg rounded-xl shadow-md p-4 hover:shadow-lg transition">
                      <div className="flex items-center space-x-4">
                        <FiFileText className="h-6 w-6 text-primary"/>
                        <div>
                          <p className="font-semibold text-primary">{file.fileName}</p>
                          <p className="text-sm text-text-secondary">Uploaded on: {new Date(file.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {file.savedAnalyses && file.savedAnalyses.length > 0 && (
                        <div className="mt-4 pl-10 border-l-2 border-gray-200">
                          <h4 className="font-semibold text-sm text-text-primary mb-2">Saved Analyses:</h4>
                          <ul className="space-y-2">
                            {file.savedAnalyses.map(analysis => (
                              <li key={analysis._id} className="flex items-center text-sm text-text-secondary">
                                <FiBarChart2 className="mr-2 text-green-500"/>
                                {analysis.name} ({analysis.xAxis} vs {analysis.yAxis})
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-lg font-medium text-text-primary">No Results Found</h3>
                    <p className="text-text-secondary mt-1">{searchQuery ? `Your search for "${searchQuery}" did not match any files.` : "You haven't uploaded any files yet."}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default HistoryPage;