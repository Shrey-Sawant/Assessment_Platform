import React from 'react';
import ExamCard from '../Cards/ExamCard';

// Accepts the new handler prop: onCreateExam
const TeacherDashboard = ({ mockData, onViewDetails, onCreateExam }) => { 
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-2xl font-semibold text-gray-800">My Exams</h2>
                <button
                    onClick={onCreateExam} // <-- CALL HANDLER ON CLICK
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01]"
                >
                    {/* Plus Icon Placeholder */}
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Create New Exam
                </button>
            </div>
            
            <div className="space-y-4">
                {mockData.exams.map(exam => (
                    <ExamCard 
                        key={exam.id} 
                        exam={exam} 
                        onViewDetails={onViewDetails} 
                    />
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;