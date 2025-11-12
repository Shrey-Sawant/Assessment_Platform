// src/components/Student/StudentResponses.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const StudentResponses = () => {
    const { user } = useAuth();
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });

    const fetchMyResponses = async () => {
        setLoading(true);
        try {
            // Fetch responses filtered by the logged-in student's ID
            const response = await api.get(`/students/responses?student_id=${user.Uid}`);
            setResponses(response.data.data);
            setAlert({ message: '', type: '' });
        } catch (error) {
            setResponses([]);
            setAlert({ message: error.response?.data?.message || 'Failed to fetch your submissions.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.Uid) {
            fetchMyResponses();
        }
    }, [user]);

    const renderResponseDetails = (responsesString) => {
        try {
          const parsed = JSON.parse(responsesString);
          // Show a summary of answers
          return `${parsed.length} answers submitted.`;
        } catch (e) {
          return 'Details available on view.';
        }
    };
    
    // In a full application, clicking 'View Details' would open a modal 
    // to display parsed Responses and ReviewedByTeacher details.

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Exam Submissions</h2>
            <Alert message={alert.message} type={alert.type} />
            
            <DataCard title="Submission History">
                {loading ? (
                    <p>Loading...</p>
                ) : responses.length === 0 ? (
                    <p>You have not submitted any exam responses yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="py-2 px-4 border">ID</th>
                                    <th className="py-2 px-4 border">Exam Title</th>
                                    <th className="py-2 px-4 border">Submitted At</th>
                                    <th className="py-2 px-4 border">Status</th>
                                    <th className="py-2 px-4 border">Score</th>
                                    <th className="py-2 px-4 border">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((res) => (
                                    <tr key={res.ResponseID} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border">{res.ResponseID}</td>
                                        <td className="py-2 px-4 border">{res.ExamTitle || `Exam ID: ${res.GeneratedExamID}`}</td>
                                        <td className="py-2 px-4 border text-sm">{new Date(res.SubmittedAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border">
                                          <span className={`px-2 py-1 text-xs rounded-full ${res.IsReviewed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {res.IsReviewed ? 'Graded' : 'Pending Review'}
                                          </span>
                                        </td>
                                        <td className="py-2 px-4 border font-bold text-lg">{res.Score || '--'}</td>
                                        <td className="py-2 px-4 border text-sm text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                            {renderResponseDetails(res.Responses)}
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

export default StudentResponses;