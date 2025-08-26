// File: client/src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FiUploadCloud, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // This function handles the logout process
  const logoutHandler = () => {
    // This is the key step: remove the user's info from the browser's storage
    localStorage.removeItem('userInfo');
    // Redirect the user to the login page
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <RxDashboard /> },
    { name: 'Upload History', path: '/history', icon: <FiUploadCloud /> },
  ];

  return (
    <aside className="flex-shrink-0 w-64 h-full bg-text-primary text-white flex flex-col">
      <div className="p-6 text-center border-b border-gray-700">
        <h2 className="text-2xl font-semibold">Excel Analytics</h2>
      </div>
      <nav className="mt-6 flex-1">
        {navLinks.map((link) => (
          <Link 
            key={link.name}
            to={link.path} 
            className={`flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 ${location.pathname === link.path ? 'bg-black bg-opacity-25 text-white' : ''}`}
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.name}
          </Link>
        ))}
        {/* The Logout is now a button that calls the logoutHandler */}
        <button 
          onClick={logoutHandler} 
          className="w-full flex items-center px-6 py-4 text-gray-300 hover:bg-gray-700 hover:text-white transition duration-150 text-left"
        >
            <span className="mr-3 text-lg"><FiLogOut /></span>
            Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;