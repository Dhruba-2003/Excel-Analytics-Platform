// File: client/src/components/Header.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
    // State to hold the logged-in user's information
    const [userInfo, setUserInfo] = useState(null);

    // This effect runs when the component loads to check if a user is logged in
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
        }
    }, []);

    return (
      <header className="flex items-center justify-between p-4 bg-content-bg border-b shadow-sm z-10">
        <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
        {/* Check if a user is logged in */}
        {userInfo ? (
          // If logged in, show their name and a link to their profile
          <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-600">
              {/* Show the user's initials */}
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-text-secondary">{userInfo.name}</span>
          </Link>
        ) : (
          // If not logged in, show a generic profile link
          <Link to="/login" className="flex items-center space-x-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <span className="text-sm font-medium text-text-secondary">User Profile</span>
          </Link>
        )}
      </header>
    );
  };
export default Header;