import React from 'react';
import DataList from '../Shared/DataList';

const AdminDashboard = ({ mockData, onAddStudent, onAddTeacher }) => {
    // Columns for the mock data tables
    const studentColumns = ['ID', 'Name', 'Email', 'Grade'];
    const teacherColumns = ['ID', 'Name', 'Email', 'Subject'];

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
                    <p className="text-sm font-medium text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{mockData.students.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-teal-500">
                    <p className="text-sm font-medium text-gray-500">Total Teachers</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{mockData.teachers.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500">
                    <p className="text-sm font-medium text-gray-500">Active Exams</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{mockData.exams.filter(e => e.status === 'Active').length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">2</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
                <button
                    onClick={onAddStudent}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 transform hover:scale-[1.01]"
                >
                    {/* Plus Icon Placeholder */}
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Student
                </button>
                <button
                    onClick={onAddTeacher}
                    className="flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-150 transform hover:scale-[1.01]"
                >
                    {/* Plus Icon Placeholder */}
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add Teacher
                </button>
            </div>

            {/* Data Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DataList
                    title="Registered Students"
                    columns={studentColumns}
                    data={mockData.students}
                />
                <DataList
                    title="Registered Teachers"
                    columns={teacherColumns}
                    data={mockData.teachers}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;