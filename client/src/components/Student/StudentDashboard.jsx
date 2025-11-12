// src/components/Student/StudentDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';

const StudentContent = () => {
    // In a full app, this would fetch the student's allocated exams 
    // using /api/admins/student-allocations?student_id={user.Uid}
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Student Portal</h2>
            <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
                <h3 className="text-xl font-bold mb-3 text-yellow-700">Available Exams</h3>
                <p className="text-gray-600 mb-4">You can view and attempt exams allocated to you.</p>
                
                {/* Placeholder for Exam List */}
                <div className="border p-4 rounded-lg mb-4">
                    <p className="font-semibold">Midterm Test - Batch A (Code: EXAM123)</p>
                    <p className="text-sm text-gray-500">Scheduled: 2025-11-03 10:00:00</p>
                    <button className="mt-2 text-sm bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-700">
                        Attempt Exam →
                    </button>
                </div>
                
                <h3 className="text-xl font-bold mb-3 mt-6 text-indigo-700">Past Responses</h3>
                <p className="text-gray-600">View your previous submissions and scores.</p>
                <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                    Go to Responses →
                </button>
            </div>
        </div>
    );
}

const StudentDashboard = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'student') return <div className="text-red-500">Unauthorized Access</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, Student {user.FName}!</h1>
        <StudentContent />
      </main>
    </div>
  );
};

export default StudentDashboard;