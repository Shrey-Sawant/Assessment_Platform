// src/components/Student/ExamAttempt.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const ExamAttempt = () => {
    const { examId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [examDetails, setExamDetails] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchExam = async () => {
            setLoading(true);
            try {
                // Fetch the Exam details
                const examRes = await api.get(`/exams/${examId}`);
                const exam = examRes.data.data[0];
                setExamDetails(exam);

                // Questions are stored as a JSON string in the DB, so parse them
                const parsedQuestions = JSON.parse(exam.Questions || '[]');
                setQuestions(parsedQuestions);
                
                // Initialize responses state
                const initialResponses = parsedQuestions.reduce((acc, q, index) => {
                    acc[index] = { q: q.q, ans: '' }; // assuming q.q is the question text
                    return acc;
                }, {});
                setResponses(initialResponses);

                setAlert({ message: '', type: '' });
            } catch (error) {
                const msg = error.response?.data?.message || `Failed to load Exam ${examId}.`;
                setAlert({ message: msg, type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        fetchExam();
    }, [examId]);
    
    // NOTE: This assumes that the ID passed in the URL is the SourceExamID (from Exams table)
    // and not the GeneratedExamID, as fetching GeneratedExam details is complex.
    // When submitting, we need to know the *actual* GeneratedExamID to save the response.
    // For simplicity, we'll assume a dummy GeneratedExamID (1) or link it dynamically in a real app.
    const DUMMY_GENERATED_EXAM_ID = 1; 

    const handleResponseChange = (qIndex, answer) => {
        setResponses(prev => ({
            ...prev,
            [qIndex]: { ...prev[qIndex], ans: answer }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setAlert({ message: '', type: '' });

        try {
            const responseArray = Object.values(responses);

            await api.post('/students/responses', {
                GeneratedExamID: DUMMY_GENERATED_EXAM_ID, // Needs to be dynamically resolved
                student_id: user.Uid,
                Responses: responseArray, // Will be stringified by the backend
                Score: 0, // Score can be 0 or null if teacher marks manually
            });

            setAlert({ message: 'Exam responses submitted successfully!', type: 'success' });
            navigate('/student/responses');
        } catch (error) {
            const msg = error.response?.data?.message || 'Response submission failed.';
            setAlert({ message: msg, type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <p>Loading exam...</p>;
    if (!examDetails) return null;

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Attempt Exam: {examDetails.Title}</h2>
            <Alert message={alert.message} type={alert.type} />
            
            <DataCard title={`Duration: ${examDetails.Duration} mins | Total Marks: ${examDetails.Marks}`}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {questions.map((qData, index) => (
                        <div key={index} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                            <p className="font-semibold mb-3">Question {index + 1}: {qData.q}</p>
                            <div className="space-y-2">
                                {/* Assuming multiple choice based on QuestionBank example */}
                                {qData.options && qData.options.map((option, optIndex) => (
                                    <label key={optIndex} className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            checked={responses[index]?.ans === option}
                                            onChange={(e) => handleResponseChange(index, e.target.value)}
                                            required
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                                {/* Fallback for short answer if options are missing */}
                                {!qData.options && (
                                    <input
                                        type="text"
                                        placeholder="Enter your answer"
                                        value={responses[index]?.ans || ''}
                                        onChange={(e) => handleResponseChange(index, e.target.value)}
                                        className="w-full border p-2 rounded"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        {submitting ? 'Submitting...' : 'Submit Final Responses'}
                    </button>
                </form>
            </DataCard>
        </div>
    );
};

export default ExamAttempt;