// src/components/Layout/Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to={`/${user?.role || ''}`} className="text-2xl font-bold tracking-wider">
          Exam <span className="text-indigo-200">System</span>
        </Link>
        <nav className="flex items-center space-x-4">
          {user && (
            <span className="text-sm font-medium hidden sm:block">
              Logged in as: <strong className="capitalize">{user.role}</strong>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-lg text-sm font-medium transition duration-200"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;