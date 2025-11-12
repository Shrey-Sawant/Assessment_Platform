// src/pages/Home.jsx
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  // If authenticated, redirect immediately to the user's dashboard
  if (isAuthenticated) {
    return <Navigate to={`/${role}`} replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-lg w-full">
        <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
          Exam Management Platform
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome! Please log in or register to access the portal.
        </p>
        
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="bg-indigo-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 shadow-md"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-200 text-indigo-700 py-3 px-8 rounded-lg text-lg font-semibold hover:bg-gray-300 transition duration-300 shadow-md"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;