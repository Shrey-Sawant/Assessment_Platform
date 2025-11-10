import React from 'react';

const Header = ({ role, username, onLogout }) => (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-bold text-indigo-600 tracking-wider">
                Assessment Platform <span className="text-gray-400 font-medium ml-2 text-sm hidden sm:inline">| {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
            </h1>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden sm:inline">Welcome, {username}</span>
                <button
                    onClick={onLogout}
                    className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 transition duration-150"
                >
                    {/* Logout Icon Placeholder (Replace with Lucide/Feather icon if using a proper React setup) */}
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Logout
                </button>
            </div>
        </div>
    </header>
);

export default Header;