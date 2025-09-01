import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiFileText, FiBarChart2, FiSearch, FiTrash2 } from 'react-icons/fi';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const query = useQuery();
  const searchQuery = query.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchHistory();
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/history?search=${searchTerm}`);
  };

  const handleSelectFile = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(fileId => fileId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === history.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(history.map(file => file._id));
    }
  };

  const handleDelete = async (idsToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${idsToDelete.length} file(s)? This action cannot be undone.`)) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { 
            headers: { Authorization: `Bearer ${userInfo.token}` },
            data: { ids: idsToDelete }
        };
        await axios.delete('/api/files', config);
        setSelectedFiles([]);
        fetchHistory();
        alert('Files deleted successfully.');
      } catch (err) {
        alert('Failed to delete files.');
      }
    }
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
                <p className="mt-2 text-text-secondary">Manage your uploaded files and saved analyses.</p>
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
              <div className="mt-8">
                <div className="flex items-center justify-between bg-white p-4 rounded-t-xl shadow-md border-b">
                    <div className="flex items-center">
                        <input 
                            type="checkbox"
                            checked={selectedFiles.length === history.length && history.length > 0}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-text-primary">Select All</label>
                    </div>
                    <button 
                        onClick={() => handleDelete(selectedFiles)} 
                        disabled={selectedFiles.length === 0}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition"
                    >
                        <FiTrash2 className="mr-2"/>
                        Delete Selected ({selectedFiles.length})
                    </button>
                </div>
                <div className="bg-content-bg rounded-b-xl shadow-md">
                    {history.length > 0 ? (
                    history.map(file => (
                        <div key={file._id} className="flex items-center p-4 border-b last:border-b-0">
                            <input 
                                type="checkbox"
                                checked={selectedFiles.includes(file._id)}
                                onChange={() => handleSelectFile(file._id)}
                                className="h-4 w-4 text-primary border-gray-300 rounded mr-4"
                            />
                            <Link to={`/dashboard/${file._id}`} className="flex-1">
                                <div className="flex items-center space-x-4">
                                    <FiFileText className="h-6 w-6 text-primary"/>
                                    <div>
                                        <p className="font-semibold text-primary">{file.fileName}</p>
                                        <p className="text-sm text-text-secondary">Uploaded on: {new Date(file.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </Link>
                            <button 
                                onClick={() => handleDelete([file._id])}
                                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    ))
                    ) : (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-medium text-text-primary">No Results Found</h3>
                        <p className="text-text-secondary mt-1">{searchQuery ? `Your search for "${searchQuery}" did not match any files.` : "You haven't uploaded any files yet."}</p>
                    </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
export default HistoryPage;