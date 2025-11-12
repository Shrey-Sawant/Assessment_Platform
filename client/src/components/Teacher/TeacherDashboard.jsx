// src/components/Teacher/TeacherDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';

const TeacherContent = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Teacher Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Question Bank CRUD Feature */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500">
                    <h3 className="text-xl font-bold mb-3 text-orange-700">Manage Question Bank</h3>
                    <p className="text-gray-600">Create, view, update, and delete Question Bank entries.</p>
                    <button className="mt-3 text-sm text-orange-600 hover:text-orange-800 font-medium">
                        Go to Question Bank →
                    </button>
                </div>
                
                {/* Exam CRUD Feature */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                    <h3 className="text-xl font-bold mb-3 text-blue-700">Manage Exams</h3>
                    <p className="text-gray-600">Create, view, update, and delete Exams.</p>
                    <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Go to Exams →
                    </button>
                </div>
                
                {/* Review Responses Feature */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-500">
                    <h3 className="text-xl font-bold mb-3 text-red-700">Review Student Responses</h3>
                    <p className="text-gray-600">View submitted responses and create reviewed response entries.</p>
                    <button className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium">
                        Go to Reviews →
                    </button>
                </div>
            </div>
        </div>
    );
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'teacher') return <div className="text-red-500">Unauthorized Access</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, Teacher {user.FName}!</h1>
        <TeacherContent />
      </main>
    </div>
  );
};

export default TeacherDashboard;