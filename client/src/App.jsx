// src/App.jsx (Updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Shared/ProtectedRoute';

// Layout & Pages
import MainLayout from './components/Layout/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import GeneratedExams from './components/Admin/GeneratedExams';
import ExamAllocation from './components/Admin/ExamAllocation';
import StudentAllocationList from './components/Admin/StudentAllocationList';

// Teacher Components
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import QuestionBank from './components/Teacher/QuestionBank';
import ExamManagement from './components/Teacher/ExamManagement';
import ReviewResponses from './components/Teacher/ReviewResponses';

// Student Components
import StudentDashboard from './components/Student/StudentDashboard';
import AllocatedExams from './components/Student/AllocatedExams';
import ExamAttempt from './components/Student/ExamAttempt';
import StudentResponses from './components/Student/StudentResponses';


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* Public registration for new students/teachers */}
          
          {/* --- PROTECTED ROUTES WITH LAYOUT --- */}
          
          <Route element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']} />}>
             <Route element={<MainLayout />}>
                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/register" element={<UserManagement />} />
                    <Route path="/admin/generated-exams" element={<GeneratedExams />} />
                    <Route path="/admin/allocations" element={<ExamAllocation />} />
                    <Route path="/admin/student-allocations" element={<StudentAllocationList />} />
                </Route>

                {/* Teacher Routes */}
                <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                    <Route path="/teacher" element={<TeacherDashboard />} />
                    <Route path="/teacher/question-bank" element={<QuestionBank />} />
                    <Route path="/teacher/exams" element={<ExamManagement />} />
                    <Route path="/teacher/review" element={<ReviewResponses />} />
                </Route>

                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="/student/allocated-exams" element={<AllocatedExams />} />
                    <Route path="/student/responses" element={<StudentResponses />} />
                    <Route path="/student/attempt/:examId" element={<ExamAttempt />} />
                </Route>
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<h1 className="text-center p-8 text-2xl">404 - Not Found</h1>} />

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;