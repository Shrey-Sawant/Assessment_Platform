// src/components/Shared/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * A wrapper component for protecting routes.
 * @param {string[]} allowedRoles - An array of roles allowed to access this route (e.g., ['admin', 'teacher']).
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-4 text-center">Loading user data...</div>;
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but role is not allowed, show unauthorized message or redirect
    return (
      <div className="p-8 text-center bg-red-100 min-h-screen">
        <h1 className="text-2xl font-bold text-red-700">Access Denied (403)</h1>
        <p className="text-gray-600">You do not have permission to view this page.</p>
        <button 
          onClick={() => window.history.back()}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  // If authenticated and role is allowed (or no role restriction), render the child routes
  return <Outlet />;
};

export default ProtectedRoute;