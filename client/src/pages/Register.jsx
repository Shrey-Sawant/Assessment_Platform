// src/pages/Register.jsx (FULLY CORRECTED)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import Alert from '../components/Shared/Alert';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FName: '', LName: '', Email: '', Phone: '', Password: '',
        role: 'student', // Default role for public registration
        DOB: '', Age: '',
    });
    const [alert, setAlert] = useState({ message: '', type: '' });
    const [loading, setLoading] = useState(false);

    const isStudent = formData.role === 'student';
    const isAdmin = formData.role === 'admin';

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Use unary plus (+) to convert to number if the field is Age or Phone
        const updatedValue = (name === 'Age' || name === 'Phone') ? (isNaN(+value) ? value : +value) : value;
        setFormData({ ...formData, [name]: updatedValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ message: '', type: '' });
        setLoading(true);

        const dataToSend = { ...formData };
        
        // --- API Endpoint Logic ---
        // Your Express app routes are mounted as:
        // /api/admins, /api/students, /api/teachers
        // And the register route is POST /register within those controllers.
        
        const endpoint = `/api/admin/register`; 

        // Map frontend 'Password' key to backend 'password' key
        dataToSend.password = dataToSend.Password;
        delete dataToSend.Password;
        
        // Clean up unnecessary fields based on role
        if (!isStudent) {
            delete dataToSend.DOB;
            delete dataToSend.Age;
        }

        // Admins cannot self-register publicly in a real system, but based on your backend structure:
        if (isAdmin) {
             // Admin doesn't have DOB/Age fields
             delete dataToSend.DOB;
             delete dataToSend.Age;
        }
        
        // Delete the role property from the payload sent to the API
        delete dataToSend.role; 

        try {
            await api.post(endpoint, dataToSend);
            setAlert({ message: `${formData.role} registered successfully! Please log in.`, type: 'success' });
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Registration failed.';
            setAlert({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">User Registration</h2>
                <Alert message={alert.message} type={alert.type} />
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Register As</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full border p-2 rounded focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                            <option value="admin">Admin (Internal Use Only)</option>
                        </select>
                    </div>

                    {/* Personal Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" name="FName" value={formData.FName} onChange={handleChange} required placeholder="First Name" className="border p-2 rounded" />
                        <input type="text" name="LName" value={formData.LName} onChange={handleChange} required placeholder="Last Name" className="border p-2 rounded" />
                        <input type="email" name="Email" value={formData.Email} onChange={handleChange} required placeholder="Email" className="border p-2 rounded" />
                        <input type="text" name="Phone" value={formData.Phone} onChange={handleChange} required placeholder="Phone" className="border p-2 rounded" />
                    </div>
                    
                    {/* Security */}
                    <input type="password" name="Password" value={formData.Password} onChange={handleChange} required placeholder="Password" className="w-full border p-2 rounded" />

                    {/* Student Specific Fields */}
                    {isStudent && (
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" name="DOB" value={formData.DOB} onChange={handleChange} required placeholder="DOB" className="border p-2 rounded" />
                            <input type="number" name="Age" value={formData.Age} onChange={handleChange} required placeholder="Age" className="border p-2 rounded" />
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Registering...' : `Register ${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}`}
                    </button>
                    
                    <p className="mt-4 text-center text-gray-600">
                        Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Log in here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;