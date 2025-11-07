import React, { useState, useCallback, useMemo } from 'react';
import Login from './components/Login';
import AdminDashboard from './components/Dashboards/AdminDashboard';
import TeacherDashboard from './components/Dashboards/TeacherDashboard';
import StudentDashboard from './components/Dashboards/StudentDashboard';
import Header from './components/Layout/Header';
import AddUserModal from './components/Modals/AddUserModal';
import ExamDetailsModal from './components/Modals/ExamDetailsModal';
import CreateExamModal from './components/Modals/CreateExamModal';
import { MOCK_DATA } from './config/mockData';
import AssessmentView from './components/views/AssessmentView';
const App = () => {
    const [user, setUser] = useState({
        isLoggedIn: false,
        role: null,
        username: ""
    });

    const [modal, setModal] = useState({
        isOpen: false,
        type: null,
        entityId: null
    });

    const [activeAssessmentId, setActiveAssessmentId] = useState(null);

    const handleLogin = useCallback((username, role) => {
        setUser({ isLoggedIn: true, role, username });
    }, []);

    const handleLogout = useCallback(() => {
        setUser({ isLoggedIn: false, role: null, username: '' });
        setModal({ isOpen: false, type: null, entityId: null });
        setActiveAssessmentId(null);
    }, []);

    const handleStartAssessment = useCallback((assessmentId) => {
        setActiveAssessmentId(assessmentId);
    }, []);

    const handleFinishAssessment = useCallback(() => {
        setActiveAssessmentId(null);
    }, []);

    const openModal = useCallback((type, entityId = null) => {
        setModal({ isOpen: true, type, entityId });
    }, []);

    const closeModal = useCallback(() => {
        setModal({ isOpen: false, type: null, entityId: null });
    }, []);

    const renderContent = useMemo(() => {
        const { role } = user;

        if (activeAssessmentId !== null) {
            const assessment = MOCK_DATA.studentAssessments.find(a => a.id === activeAssessmentId);
            return (
                <div className="bg-gray-100 min-h-screen pt-4">
                    <AssessmentView 
                        assessment={assessment}
                        onFinishAssessment={handleFinishAssessment}
                    />
                </div>
            );
        }

        let content;
        let title;

        switch (role) {
            case "admin":
                title = "Admin Dashboard";
                content = <AdminDashboard mockData={MOCK_DATA} onAddStudent={() => openModal("student")} onAddTeacher={() => openModal("teacher")} />;
                break;

            case "teacher":
                title = "Teacher Dashboard";
                content = <TeacherDashboard mockData={MOCK_DATA} onViewDetails={(id) => openModal("examDetails", id)} onCreateExam={() => openModal("createExam")} />;
                break;

            case "student":
                title = "Student Dashboard";
                content = <StudentDashboard onStartAssessment={handleStartAssessment} />;
                break;

            default:
                return null;
        }

        return (
            <div className="bg-gray-100 min-h-screen pt-16">
                <Header role={role} username={user.username} onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{title}</h1>
                    {content}
                </main>

                {modal.isOpen && modal.type === 'createExam' && (
                    <CreateExamModal isOpen onClose={closeModal} />
                )}

                {modal.isOpen && modal.type === 'examDetails' && (
                    <ExamDetailsModal isOpen examId={modal.entityId} onClose={closeModal} />
                )}

                {modal.isOpen && (modal.type === 'student' || modal.type === 'teacher') && (
                    <AddUserModal type={modal.type} isOpen onClose={closeModal} />
                )}
            </div>
        );

    }, [user, modal, activeAssessmentId]);

    if (!user.isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return renderContent;
};

export default App;