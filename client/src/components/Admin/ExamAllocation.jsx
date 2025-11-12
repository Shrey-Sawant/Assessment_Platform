// src/components/Admin/ExamAllocation.jsx
import React, { useState } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const ExamAllocation = () => {
  const { user } = useAuth();
  const [allocationType, setAllocationType] = useState('student'); // 'student' or 'teacher'
  const [formData, setFormData] = useState({
    target_id: '', // student_id or teacher_id
    exam_id: '',
  });
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAllocation = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });
    setLoading(true);

    const isStudent = allocationType === 'student';
    const endpoint = isStudent ? '/admins/allocate-students' : '/admins/allocate-teachers';
    
    // The backend controller uses req.admin for Admin ID, but some routes 
    // explicitly ask for AllocatedByAdmin in the body (as seen in admin.contoller.js).
    // To satisfy the body requirement:
    const payload = {
      exam_id: Number(formData.exam_id),
      AllocatedByAdmin: user?.admin_id, // Assuming user object contains admin_id after login
    };

    if (isStudent) {
      payload.student_id = Number(formData.target_id);
    } else {
      payload.teacher_id = Number(formData.target_id);
      // NOTE: Teacher allocation route body expects AllocatedStudentIDs (LONGTEXT), 
      // but we omit it here as it's optional for the teacher allocation itself.
    }

    try {
      await api.post(endpoint, payload);
      setAlert({ message: `${allocationType.charAt(0).toUpperCase() + allocationType.slice(1)} allocated successfully!`, type: 'success' });
      setFormData({ target_id: '', exam_id: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Allocation failed.';
      setAlert({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Exam Allocation</h2>
      <Alert message={alert.message} type={alert.type} />
      
      <DataCard title={`Allocate Exam to ${allocationType.charAt(0).toUpperCase() + allocationType.slice(1)}`}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Select Allocation Target</label>
          <select
            value={allocationType}
            onChange={(e) => setAllocationType(e.target.value)}
            className="border p-2 rounded-lg w-full md:w-1/2"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <form onSubmit={handleAllocation} className="space-y-4">
          <div>
            <label className="block text-gray-700">
              {allocationType === 'student' ? 'Student ID (Uid)' : 'Teacher ID'}
            </label>
            <input
              type="number"
              name="target_id"
              value={formData.target_id}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder={`Enter ${allocationType} ID`}
            />
          </div>
          <div>
            <label className="block text-gray-700">Exam ID</label>
            <input
              type="number"
              name="exam_id"
              value={formData.exam_id}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
              placeholder="Enter the Exam ID to allocate"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Allocating...' : `Allocate Exam to ${allocationType.charAt(0).toUpperCase() + allocationType.slice(1)}`}
          </button>
        </form>
      </DataCard>
    </div>
  );
};

export default ExamAllocation;