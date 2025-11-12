// src/components/Admin/GeneratedExams.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const GeneratedExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    Title: '', Code: '', SourceExamID: '', Duration: '', TotalMarks: '', ScheduledDateTime: '', CalculatorAllowed: false,
  });
  const { user } = useAuth();

  const fetchExams = async () => {
    setLoading(true);
    try {
      // NOTE: This route filters by CreatedByAdmin, so it only shows exams created by the logged-in admin.
      const response = await api.get('/generated-exams');
      setExams(response.data.data);
      setAlert({ message: '', type: '' });
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to fetch generated exams.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });
    
    // Simple validation
    if (!formData.Title || !formData.Code || !formData.SourceExamID || !formData.Duration || !formData.TotalMarks) {
        setAlert({ message: "Please fill all required fields.", type: 'error' });
        return;
    }

    try {
      await api.post('/generated-exams', { 
          ...formData,
          SourceExamID: Number(formData.SourceExamID),
          Duration: Number(formData.Duration),
          TotalMarks: Number(formData.TotalMarks),
          // Backend handles CreatedByAdmin using req.admin based on auth token, 
          // but we include it if needed. The controller uses req.admin.admin_id.
      });
      setAlert({ message: 'Generated Exam created successfully!', type: 'success' });
      setIsFormVisible(false);
      fetchExams();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to create exam.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Generated Exam?')) return;
    try {
      await api.delete(`/generated-exams/${id}`);
      setAlert({ message: `Exam ${id} deleted successfully!`, type: 'success' });
      fetchExams();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to delete exam.', type: 'error' });
    }
  };

  return (
    <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Generated Exam Management</h2>
        <Alert message={alert.message} type={alert.type} />
        
        <button
            onClick={() => setIsFormVisible(!isFormVisible)}
            className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
            {isFormVisible ? 'Hide Form' : 'Create New Generated Exam'}
        </button>

        {isFormVisible && (
             <DataCard title="Create Generated Exam" className="mb-6">
                <form onSubmit={handleCreate} className="space-y-4">
                    {/* Input fields... */}
                    <div className="grid grid-cols-2 gap-4">
                         <input name="Title" placeholder="Title" value={formData.Title} onChange={handleChange} required className="border p-2 rounded" />
                         <input name="Code" placeholder="Unique Code" value={formData.Code} onChange={handleChange} required className="border p-2 rounded" />
                         <input type="number" name="SourceExamID" placeholder="Source Exam ID (From Exams Table)" value={formData.SourceExamID} onChange={handleChange} required className="border p-2 rounded" />
                         <input type="number" name="Duration" placeholder="Duration (mins)" value={formData.Duration} onChange={handleChange} required className="border p-2 rounded" />
                         <input type="number" name="TotalMarks" placeholder="Total Marks" value={formData.TotalMarks} onChange={handleChange} required className="border p-2 rounded" />
                         <input type="datetime-local" name="ScheduledDateTime" placeholder="Scheduled Date/Time" value={formData.ScheduledDateTime} onChange={handleChange} className="border p-2 rounded" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="CalculatorAllowed" checked={formData.CalculatorAllowed} onChange={handleChange} className="mr-2" />
                        <label>Calculator Allowed</label>
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Create Exam</button>
                </form>
             </DataCard>
        )}

        <DataCard title="Existing Generated Exams">
            {loading ? (
                <p>Loading...</p>
            ) : exams.length === 0 ? (
                <p>No generated exams found for this admin.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Title</th>
                                <th className="py-2 px-4 border">Code</th>
                                <th className="py-2 px-4 border">Duration/Marks</th>
                                <th className="py-2 px-4 border">Scheduled</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.GeneratedExamID} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{exam.GeneratedExamID}</td>
                                    <td className="py-2 px-4 border">{exam.Title}</td>
                                    <td className="py-2 px-4 border font-mono text-sm">{exam.Code}</td>
                                    <td className="py-2 px-4 border">{exam.Duration} mins / {exam.TotalMarks}</td>
                                    <td className="py-2 px-4 border text-sm">{new Date(exam.ScheduledDateTime).toLocaleString()}</td>
                                    <td className="py-2 px-4 border">
                                        <button onClick={() => handleDelete(exam.GeneratedExamID)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                                        {/* Update functionality would require a complex modal/form */}
                                    </td>
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

export default GeneratedExams;