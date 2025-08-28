import { Link, useLocation, useNavigate } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FiUploadCloud, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/', icon: <RxDashboard /> },
    { name: 'Upload History', path: '/history', icon: <FiUploadCloud /> },
  ];

  return (
    // The background color is changed here from bg-text-primary to bg-blue-800
    <aside className="flex-shrink-0 w-64 h-full bg-blue-800 text-white flex flex-col">
      <div className="p-6 text-center border-b border-blue-900">
        <h2 className="text-2xl font-semibold">Excel Analytics</h2>
      </div>
      <nav className="mt-6 flex-1">
        {navLinks.map((link) => (
          <Link 
            key={link.name}
            to={link.path} 
            // Updated hover and active colors to match the new theme
            className={`flex items-center px-6 py-4 text-blue-100 hover:bg-blue-700 hover:text-white transition duration-150 ${location.pathname === link.path ? 'bg-blue-900 text-white' : ''}`}
          >
            <span className="mr-3 text-lg">{link.icon}</span>
            {link.name}
          </Link>
        ))}
        <button 
          onClick={logoutHandler} 
          className="w-full flex items-center px-6 py-4 text-blue-100 hover:bg-blue-700 hover:text-white transition duration-150 text-left"
        >
            <span className="mr-3 text-lg"><FiLogOut /></span>
            Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;