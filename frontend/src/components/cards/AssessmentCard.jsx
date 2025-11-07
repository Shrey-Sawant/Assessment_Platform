import React from 'react';

// ENSURE 'onStartAssessment' is accepted as a prop
const AssessmentCard = ({ assessment, onStartAssessment }) => ( 
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border-l-4 border-blue-500">
        <h3 className="text-xl font-semibold text-gray-800">{assessment.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{assessment.teacher} - {assessment.subject}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
            <span>Total Marks: <span className="font-medium">{assessment.totalMarks}</span></span>
            <span>Due Date: <span className="font-medium">{assessment.dueDate}</span></span>
            <span>Time Limit: <span className="font-medium">{assessment.timeLimit}</span></span>
            <span>Status: <span className={`font-semibold ${assessment.status === 'Pending' ? 'text-orange-600' : 'text-green-600'}`}>{assessment.status}</span></span>
        </div>
        
        <div className="flex justify-end">
            {assessment.status === 'Pending' ? (
                <button 
                    // ADDED THE onClick HANDLER HERE!
                    onClick={() => onStartAssessment(assessment.id)} 
                    className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                    Start Assessment
                </button>
            ) : (
                <button className="px-4 py-2 text-sm font-medium rounded-md text-blue-600 border border-blue-200 hover:bg-blue-50 transition">
                    View Result
                </button>
            )}
        </div>
    </div>
);

export default AssessmentCard;