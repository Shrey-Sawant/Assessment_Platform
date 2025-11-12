// src/components/Teacher/QuestionBank.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';

const QuestionBank = () => {
  const [qbs, setQbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({ Q_ID: null, Title: '', Questions: '' });

  const fetchQBs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/questionbank');
      setQbs(response.data.data);
      setAlert({ message: '', type: '' });
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to fetch question banks.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQBs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleEdit = (qb) => {
      setFormData({ Q_ID: qb.Q_ID, Title: qb.Title, Questions: qb.Questions });
      setIsFormVisible(true);
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });

    // Questions should be a stringified JSON object
    let questionsPayload = formData.Questions;
    try {
        JSON.parse(formData.Questions);
    } catch (e) {
        setAlert({ message: "Questions must be valid JSON format.", type: 'error' });
        return;
    }
    
    const payload = { Title: formData.Title, Questions: questionsPayload };
    
    try {
      if (formData.Q_ID) {
        // Update
        await api.put(`/questionbank/${formData.Q_ID}`, payload);
        setAlert({ message: 'Question Bank updated successfully!', type: 'success' });
      } else {
        // Create
        await api.post('/questionbank', payload);
        setAlert({ message: 'Question Bank created successfully!', type: 'success' });
      }
      
      setFormData({ Q_ID: null, Title: '', Questions: '' });
      setIsFormVisible(false);
      fetchQBs();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Action failed.', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Question Bank entry?')) return;
    try {
      await api.delete(`/questionbank/${id}`);
      setAlert({ message: `Question Bank ${id} deleted successfully!`, type: 'success' });
      fetchQBs();
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Failed to delete.', type: 'error' });
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Question Bank Management</h2>
      <Alert message={alert.message} type={alert.type} />
      
      <button
            onClick={() => { setIsFormVisible(!isFormVisible); setFormData({ Q_ID: null, Title: '', Questions: '' }); }}
            className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
            {formData.Q_ID ? 'Editing...' : isFormVisible ? 'Hide Form' : 'Create New QB Entry'}
      </button>

      {isFormVisible && (
        <DataCard title={formData.Q_ID ? "Edit Question Bank" : "Create New Question Bank"} className="mb-6">
            <form onSubmit={handleAction} className="space-y-4">
                <input name="Title" placeholder="Title" value={formData.Title} onChange={handleChange} required className="w-full border p-2 rounded" />
                <textarea 
                    name="Questions" 
                    placeholder="Questions (must be valid JSON array of objects)" 
                    value={formData.Questions} 
                    onChange={handleChange} 
                    required 
                    rows="6" 
                    className="w-full border p-2 rounded font-mono text-sm"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                    {formData.Q_ID ? 'Update QB' : 'Create QB'}
                </button>
            </form>
        </DataCard>
      )}

      <DataCard title="Existing Question Banks">
            {loading ? (
                <p>Loading...</p>
            ) : qbs.length === 0 ? (
                <p>No Question Bank entries found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border">ID</th>
                                <th className="py-2 px-4 border">Title</th>
                                <th className="py-2 px-4 border">Questions Length</th>
                                <th className="py-2 px-4 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qbs.map((qb) => (
                                <tr key={qb.Q_ID} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border">{qb.Q_ID}</td>
                                    <td className="py-2 px-4 border">{qb.Title}</td>
                                    <td className="py-2 px-4 border">{qb.Questions.length} characters</td>
                                    <td className="py-2 px-4 border flex space-x-2">
                                        <button onClick={() => handleEdit(qb)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                                        <button onClick={() => handleDelete(qb.Q_ID)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
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

export default QuestionBank;