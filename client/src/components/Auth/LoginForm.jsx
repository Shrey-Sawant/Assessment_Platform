// src/components/Auth/LoginForm.jsx
import React from 'react';
// This component should receive handleSubmit, formData, handleChange, etc. as props 
// if it were used separately. Since the main login logic is in pages/Login.jsx, 
// this is a simplified presentation component.

const LoginForm = ({ handleSubmit, formData, handleChange, loading, error, isStudent, setRole }) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">System Login</h2>
      
      {/* Role Selection (Essential for multi-user backend) */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Role</label>
        <select
          value={formData.role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      
      {/* Email and Password fields */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Email</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.Password}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Logging In...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;