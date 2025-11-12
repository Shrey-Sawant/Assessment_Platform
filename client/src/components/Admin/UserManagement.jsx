// src/components/Admin/UserManagement.jsx
import React, { useState } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    FName: '', LName: '', Email: '', Phone: '', Password: '',
    role: 'teacher', // Default to registering a Teacher
    // Student specific fields
    DOB: '', Age: '',
  });
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const isStudent = formData.role === 'student';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });
    setLoading(true);

    const dataToSend = { ...formData };
    const endpoint = `/${formData.role}s/register`; // /teachers/register or /students/register

    // Clean up unnecessary fields based on role
    if (!isStudent) {
        delete dataToSend.DOB;
        delete dataToSend.Age;
    }

    try {
      const response = await api.post(endpoint, dataToSend);
      setAlert({ message: `${formData.role} registered successfully!`, type: 'success' });
      setFormData({ // Reset form
        FName: '', LName: '', Email: '', Phone: '', Password: '', role: formData.role, DOB: '', Age: '',
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      setAlert({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">User Management & Registration</h2>
        <Alert message={alert.message} type={alert.type} />
        
        <DataCard title={`Register New ${formData.role === 'teacher' ? 'Teacher' : 'Student'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Role to Register</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                        >
                            <option value="teacher">Teacher</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">First Name</label>
                        <input type="text" name="FName" value={formData.FName} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Last Name</label>
                        <input type="text" name="LName" value={formData.LName} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">Email</label>
                        <input type="email" name="Email" value={formData.Email} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                </div>
                
                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label className="block text-gray-700">Phone</label>
                        <input type="text" name="Phone" value={formData.Phone} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                    <div className="w-1/2">
                        <label className="block text-gray-700">Password</label>
                        <input type="password" name="Password" value={formData.Password} onChange={handleChange} required className="w-full border p-2 rounded" />
                    </div>
                </div>

                {isStudent && (
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700">DOB</label>
                            <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} required className="w-full border p-2 rounded" />
                        </div>
                        <div className="w-1/2">
                            <label className="block text-gray-700">Age</label>
                            <input type="number" name="Age" value={formData.Age} onChange={handleChange} required className="w-full border p-2 rounded" />
                        </div>
                    </div>
                )}
                
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : `Register ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                </button>
            </form>
        </DataCard>
    </div>
  );
};

export default UserManagement;