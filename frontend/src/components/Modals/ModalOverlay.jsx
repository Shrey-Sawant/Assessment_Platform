import React from 'react';

const ModalOverlay = ({ title, children, onClose }) => (
    <div className="fixed inset-0  bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white  rounded-xl shadow-2xl w-[700px]max-w-md transform scale-100 transition-transform duration-300">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                    {/* Close Icon Placeholder */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    </div>
);

export default ModalOverlay;