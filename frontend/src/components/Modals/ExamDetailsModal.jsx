import React from 'react';
import ModalOverlay from './ModalOverlay';

const StudentResultRow = ({ result }) => {
    // Determine color based on score for visual feedback
    const scoreColor = result.score === null 
        ? 'text-gray-500' 
        : (result.score >= 80 ? 'text-green-600' : (result.score >= 60 ? 'text-orange-600' : 'text-red-600'));

    return (
        <tr className="hover:bg-gray-50 transition duration-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {result.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.studentId}
            </td>
            <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${scoreColor}`}>
                {result.score !== null ? `${result.score} / ${result.total}` : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    result.status === 'Completed' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                }`}>
                    {result.status}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-indigo-600 hover:text-indigo-900 text-sm">Review</button>
            </td>
        </tr>
    );
};


const ExamDetailsModal = ({ exam, results, onClose }) => {
    return (
        // ModalOverlay needs to be imported, assumed to be in the same directory.
        <ModalOverlay title={`Results for: ${exam.title}`} onClose={onClose}>
            <div className="mb-4  p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-sm font-medium text-indigo-800">
                    Average Score: <span className="font-bold">{exam.avgScore}</span> | 
                    Submitted: <span className="font-bold">{exam.submitted}</span> of {exam.totalStudents}
                </p>
            </div>
            
            <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {results.length > 0 ? (
                            results.map(result => <StudentResultRow key={result.studentId} result={result} />)
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">No results found for this exam.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </ModalOverlay>
    );
};

export default ExamDetailsModal;