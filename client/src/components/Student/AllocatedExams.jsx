// src/components/Student/AllocatedExams.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const AllocatedExams = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [allocations, setAllocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: '', type: '' });

    const fetchAllocations = async () => {
        setLoading(true);
        try {
            // Note: The /admin/student-allocations route requires a student_id query param
            const response = await api.get(`/admins/student-allocations?student_id=${user.Uid}`);
            setAllocations(response.data.data);
            setAlert({ message: '', type: '' });
        } catch (error) {
            setAllocations([]);
            setAlert({ message: error.response?.data?.message || 'Failed to fetch allocated exams.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.Uid) {
            fetchAllocations();
        }
    }, [user]);

    // Simplified logic: Assuming AllocatedExamID is sufficient to launch the exam
    const handleAttemptExam = (examId) => {
        navigate(`/student/attempt/${examId}`);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">My Allocated Exams</h2>
            <Alert message={alert.message} type={alert.type} />
            
            <DataCard title="Exams Scheduled For You">
                {loading ? (
                    <p>Loading...</p>
                ) : allocations.length === 0 ? (
                    <p>You have no exams allocated yet.</p>
                ) : (
                    <div className="space-y-4">
                        {allocations.map((alloc) => (
                            <div key={alloc.exam_id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <p className="font-semibold text-lg">{`Exam ID: ${alloc.exam_id}`}</p>
                                    <p className="text-sm text-gray-600">Allocated by Admin: {alloc.AllocatedByAdmin}</p>
                                </div>
                                <button 
                                    onClick={() => handleAttemptExam(alloc.exam_id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                >
                                    Start/Resume Exam
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </DataCard>
        </div>
    );
};

export default AllocatedExams;