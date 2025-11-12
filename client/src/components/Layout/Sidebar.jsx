// src/components/Layout/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = {
  admin: [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Register/Update User', path: '/admin/register' },
    { name: 'Generated Exams', path: '/admin/generated-exams' },
    { name: 'Exam Allocations', path: '/admin/allocations' },
    { name: 'Student Allocations List', path: '/admin/student-allocations' },
  ],
  teacher: [
    { name: 'Dashboard', path: '/teacher' },
    { name: 'Manage Question Bank', path: '/teacher/question-bank' },
    { name: 'Manage Exams', path: '/teacher/exams' },
    { name: 'Review Responses', path: '/teacher/review' },
  ],
  student: [
    { name: 'Dashboard', path: '/student' },
    { name: 'My Allocated Exams', path: '/student/allocated-exams' },
    { name: 'My Submissions', path: '/student/responses' },
  ],
};

const Sidebar = () => {
  const { user, role } = useAuth();
  if (!role) return null;

  const links = navItems[role];

  return (
    <div className="w-64 bg-indigo-700 h-full text-white flex flex-col p-4 shadow-2xl">
      <div className="mb-8 border-b border-indigo-600 pb-4">
        <div className="text-xl font-bold capitalize">{user.role} Panel</div>
        <div className="text-sm text-indigo-300">{user.Email}</div>
      </div>
      <nav className="flex flex-col space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `p-2 rounded-lg transition duration-150 ${
                isActive
                  ? 'bg-indigo-500 font-semibold'
                  : 'hover:bg-indigo-600'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;