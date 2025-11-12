// src/components/Admin/StudentAllocationList.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';

const StudentAllocationList = () => {
  const [allocations, setAllocations] = useState([]);
  const [allocationType, setAllocationType] = useState('student'); // 'student' or 'teacher'
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });

  const fetchAllocations = async (type) => {
    setLoading(true);
    setAlert({ message: '', type: '' });
    
    const endpoint = type === 'student' ? '/admins/student-allocations' : '/admins/teacher-allocations';

    try {
      const response = await api.get(endpoint);
      setAllocations(response.data.data);
    } catch (error) {
      setAllocations([]);
      const errorMessage = error.response?.data?.message || `Failed to fetch ${type} allocations.`;
      setAlert({ message: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllocations(allocationType);
  }, [allocationType]);

  const handleTypeChange = (e) => {
    setAllocationType(e.target.value);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">View Exam Allocations</h2>
      <Alert message={alert.message} type={alert.type} />
      
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select Allocation List</label>
        <select
          value={allocationType}
          onChange={handleTypeChange}
          className="border p-2 rounded-lg w-full md:w-1/2"
        >
          <option value="student">Student Exam Allocations</option>
          <option value="teacher">Teacher Exam Allocations</option>
        </select>
      </div>

      <DataCard title={`${allocationType.charAt(0).toUpperCase() + allocationType.slice(1)} Allocations`}>
        {loading ? (
          <p>Loading...</p>
        ) : allocations.length === 0 ? (
          <p>No {allocationType} allocations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  {/* Common Columns */}
                  <th className="py-2 px-4 border">Exam ID</th>
                  <th className="py-2 px-4 border">Allocated By Admin</th>
                  
                  {/* Role-Specific Columns */}
                  {allocationType === 'student' ? (
                    <>
                      <th className="py-2 px-4 border">Student ID</th>
                      <th className="py-2 px-4 border">Student Name</th>
                    </>
                  ) : (
                    <>
                      <th className="py-2 px-4 border">Teacher ID</th>
                      <th className="py-2 px-4 border">Teacher Name</th>
                      <th className="py-2 px-4 border">Allocated Student IDs</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {allocations.map((alloc) => (
                  <tr key={alloc.AllocationID || `${alloc.exam_id}-${alloc.student_id || alloc.teacher_id}`} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{alloc.exam_id}</td>
                    <td className="py-2 px-4 border">{alloc.AllocatedByAdmin}</td>
                    
                    {allocationType === 'student' ? (
                      <>
                        <td className="py-2 px-4 border">{alloc.student_id}</td>
                        <td className="py-2 px-4 border">{alloc.StudentName}</td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border">{alloc.teacher_id}</td>
                        <td className="py-2 px-4 border">{alloc.TeacherName}</td>
                        <td className="py-2 px-4 border text-sm max-w-xs overflow-hidden">
                          {alloc.AllocatedStudentIDs || 'N/A'}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </div>
  );
};

export default StudentAllocationList;