import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return (
      <header className="flex items-center justify-between p-4 bg-content-bg border-b shadow-sm z-10">
        {/* The h1 is now the main element on the left */}
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        
        {userInfo ? (
          <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text-secondary">{userInfo.name}</span>
          </Link>
        ) : (
          <Link to="/login" className="flex items-center space-x-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium text-text-secondary">User Profile</span>
          </Link>
        )}
      </header>
    );
  };
export default Header;