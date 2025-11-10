import React from 'react';
import ModalOverlay from './ModalOverlay';

const AddUserModal = ({ userType, onClose }) => {
    const isStudent = userType === 'student';
    const title = isStudent ? 'Add New Student' : 'Add New Teacher';

    const handleSubmit = (e) => {
        e.preventDefault();
        // MOCK LOGIC: In a real app, this would dispatch an action or call an API.
        console.log(`Submitting form for new ${userType}...`);
        alert(`Mock: Successfully added new ${isStudent ? 'Student' : 'Teacher'}!`);
        onClose();
    };

    return (
        <ModalOverlay title={title} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        placeholder="John Doe"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                        placeholder="john.doe@school.com"
                        required
                    />
                </div>
                {isStudent ? (
                    <div>
                        <label htmlFor="grade" className="block text-sm font-medium text-gray-700">Grade/Class</label>
                        <input
                            type="text"
                            id="grade"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            placeholder="10A"
                            required
                        />
                    </div>
                ) : (
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject Taught</label>
                        <input
                            type="text"
                            id="subject"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                            placeholder="Science / History"
                            required
                        />
                    </div>
                )}
                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                    >
                        Save {isStudent ? 'Student' : 'Teacher'}
                    </button>
                </div>
            </form>
        </ModalOverlay>
    );
};

export default AddUserModal;