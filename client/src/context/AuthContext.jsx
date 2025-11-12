// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (role, credentials) => {
    try {
      const endpoint = `/api/admin/login`; // e.g., /admins/login
      const response = await api.post(endpoint, credentials);
      
      const userData = {
        ...response.data.data,
        role: role, // Store the role for ProtectedRoute logic
      };

      // Store in state and local storage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = () => {
    // Note: The backend doesn't have an explicit logout route, 
    // so we just clear local state/storage.
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: user?.role,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};