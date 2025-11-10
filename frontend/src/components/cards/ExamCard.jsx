import React from 'react';

// Accepts the new handler prop
const ExamCard = ({ exam, onViewDetails }) => (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-200 p-6 border-l-4 border-indigo-500 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-grow">
            <h3 className="text-xl font-semibold text-gray-800">{exam.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{exam.subject}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                <span>Questions: <span className="font-medium text-indigo-600">{exam.questions}</span></span>
                <span>Total Students: <span className="font-medium">{exam.totalStudents}</span></span>
                <span>Submitted: <span className="font-medium">{exam.submitted}/{exam.totalStudents}</span></span>
                <span>Avg Score: <span className="font-medium text-teal-600">{exam.avgScore}</span></span>
            </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                exam.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
            }`}>
                {exam.status}
            </span>
            <button 
                // Call the handler with the specific exam ID
                onClick={() => onViewDetails(exam.id)} 
                className="px-4 py-2 text-sm font-medium rounded-md text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition"
            >
                View Details
            </button>
        </div>
    </div>
);

export default ExamCard;