// src/components/Teacher/ExamManagement.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const ExamManagement = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    exam_id: null, Title: '', Duration: '', Marks: '', Questions: ''
  });

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await api.get('/exams');
      setExams(response.data.data);
      setAlert({ message: '', type: '' });
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to fetch exams.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleEdit = (exam) => {
      setFormData({ 
          exam_id: exam.exam_id, 
          Title: exam.Title, 
          Duration: exam.Duration, 
          Marks: exam.Marks, 
          Questions: exam.Questions 
      });
      setIsFormVisible(true);
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });

    let questionsPayload = formData.Questions;
    try {
        JSON.parse(formData.Questions); // Validate JSON format
    } catch (e) {
        setAlert({ message: "Questions must be valid JSON array/string.", type: 'error' });
        return;
    }
    
    const payload = { 
        Title: formData.Title, 
        Duration: Number(formData.Duration), 
        Marks: Number(formData.Marks), 
        Questions: questionsPayload,
        // The endpoint is protected by verifyTeacherToken, which is sufficient, 
        // but the controller explicitly expects CreatedByAdmin for creation.
        CreatedByAdmin: user?.id, // Assuming 'id' is teacher_id after teacher login
    };
    
    try {
      if (formData.exam_id) {
        // Update
        await api.put(`/exams/${formData.exam_id}`, payload);
        setAlert({ message: 'Exam updated successfully!', type: 'success' });
      } else {
        // Create
        await api.post('/exams/createExam', payload);
        setAlert({ message: 'Exam created successfully!', type: 'success' });
      }
      
      setFormData({ exam_id: null, Title: '', Duration: '', Marks: '', Questions: '' });
      setIsFormVisible(false);
      fetchExams();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Action failed.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Exam? This will affect generated exams!')) return;
    try {
      await api.delete(`/exams/${id}`);
      setAlert({ message: `Exam ${id} deleted successfully!`, type: 'success' });
      fetchExams();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to delete.', type: 'error' });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Exam Management (Base Exams)</h2>
      <Alert message={alert.message} type={alert.type} />
      
      <button
            onClick={() => { setIsFormVisible(!isFormVisible); setFormData({ exam_id: null, Title: '', Duration: '', Marks: '', Questions: '' }); }}
            className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
            {formData.exam_id ? 'Editing...' : isFormVisible ? 'Hide Form' : 'Create New Exam'}
      </button>

      {isFormVisible && (
        <DataCard title={formData.exam_id ? "Edit Exam" : "Create New Exam"} className="mb-6">
            <form onSubmit={handleAction} className="space-y-4">
                <input name="Title" placeholder="Exam Title" value={formData.Title} onChange={handleChange} required className="w-full border p-2 rounded" />
                <div className='flex space-x-4'>
                    <input type="number" name="Duration" placeholder="Duration (mins)" value={formData.Duration} onChange={handleChange} required className="w-1/2 border p-2 rounded" />
                    <input type="number" name="Marks" placeholder="Total Marks" value={formData.Marks} onChange={handleChange} required className="w-1/2 border p-2 rounded" />
                </div>
                <textarea 
                    name="Questions" 
                    placeholder="Questions (must be valid JSON array/string from QuestionBank)" 
                    value={formData.Questions} 
                    onChange={handleChange} 
                    required 
                    rows="6" 
                    className="w-full border p-2 rounded font-mono text-sm"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    {formData.exam_id ? 'Update Exam' : 'Create Exam'}
                </button>
            </form>
        </DataCard>
      )}

      <DataCard title="Existing Exams">
            {loading ? (
                <p>Loading...</p>
            ) : exams.length === 0 ? (
                <p>No Exams found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Title</th>
                                <th className="py-2 px-4 border">Duration</th>
                                <th className="py-2 px-4 border">Marks</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams.map((exam) => (
                                <tr key={exam.exam_id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{exam.exam_id}</td>
                                    <td className="py-2 px-4 border">{exam.Title}</td>
                                    <td className="py-2 px-4 border">{exam.Duration} mins</td>
                                    <td className="py-2 px-4 border">{exam.Marks}</td>
                                    <td className="py-2 px-4 border flex space-x-2">
                                        <button onClick={() => handleEdit(exam)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                                        <button onClick={() => handleDelete(exam.exam_id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
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

export default ExamManagement;