// src/components/Admin/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from '../Layout/Header';

// Placeholder components for Admin features
const AdminContent = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Admin Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* User Registration/Update Feature */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-500">
                    <h3 className="text-xl font-bold mb-3 text-indigo-700">Manage Users</h3>
                    <p className="text-gray-600">Register new Students/Teachers, and update Admin details.</p>
                    <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Go to User Management →
                    </button>
                </div>
                
                {/* Exam Allocation Feature */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
                    <h3 className="text-xl font-bold mb-3 text-green-700">Allocate Exams</h3>
                    <p className="text-gray-600">Allocate Exams to Students and Teachers.</p>
                    <button className="mt-3 text-sm text-green-600 hover:text-green-800 font-medium">
                        Go to Allocation →
                    </button>
                </div>

                {/* Generated Exams CRUD Feature (Admin Route) */}
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
                    <h3 className="text-xl font-bold mb-3 text-purple-700">Generated Exams</h3>
                    <p className="text-gray-600">Create, view, update, and delete Generated Exams.</p>
                    <button className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-medium">
                        Go to Generated Exams →
                    </button>
                </div>

            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Allocation Views</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                    <p>View student-exam allocations (`/api/admins/student-allocations`).</p>
                    <p>View teacher-exam allocations (`/api/admins/teacher-allocations`).</p>
                </div>
            </div>
        </div>
    );
}


const AdminDashboard = () => {
  const { user } = useAuth();
  
  if (!user || user.role !== 'admin') return <div className="text-red-500">Unauthorized Access</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, Admin {user.FName}!</h1>
        <AdminContent />
      </main>
    </div>
  );
};

export default AdminDashboard;