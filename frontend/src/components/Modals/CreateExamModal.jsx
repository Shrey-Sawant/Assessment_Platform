import React from 'react';
import ModalOverlay from './ModalOverlay';

const CreateExamModal = ({ onClose }) => {
    
    const handleSubmit = (e) => {
        e.preventDefault();
        // MOCK LOGIC: Collect data and simulate creation
        console.log("Creating new exam...");
        alert("Mock: New exam created successfully!");
        onClose();
    };

    return (
        <ModalOverlay title="📝 Create New Exam" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Exam Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Exam Title</label>
                    <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        placeholder="e.g., Q4 Chemistry Midterm"
                        required
                    />
                </div>

                {/* Subject and Questions */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <select
                            id="subject"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border bg-white"
                            required
                        >
                            <option value="">Select Subject</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="History">History</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="questions" className="block text-sm font-medium text-gray-700">Total Questions</label>
                        <input
                            type="number"
                            id="questions"
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            placeholder="e.g., 25"
                            required
                        />
                    </div>
                </div>

                {/* Date and Time Limit */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Due Date</label>
                        <input
                            type="date"
                            id="date"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">Time Limit (Mins)</label>
                        <input
                            type="number"
                            id="timeLimit"
                            min="10"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            placeholder="e.g., 60"
                            required
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                        Publish Exam
                    </button>
                </div>
            </form>
        </ModalOverlay>
    );
};

export default CreateExamModal;