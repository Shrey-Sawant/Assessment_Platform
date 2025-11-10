import React from 'react';
import AssessmentCard from '../Cards/AssessmentCard';
import { MOCK_DATA } from '../../config/mockData';

const StudentDashboard = ({ onStartAssessment }) => {
    const pendingAssessments = MOCK_DATA.studentAssessments.filter(a => a.status === 'Pending');
    const completedAssessments = MOCK_DATA.studentAssessments.filter(a => a.status === 'Completed');

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">
                🚀 Upcoming Assessments ({pendingAssessments.length})
            </h2>

            <div className="space-y-4">
                {pendingAssessments.length > 0 ? (
                    pendingAssessments.map(assessment => (
                        <AssessmentCard
                            key={assessment.id}
                            assessment={assessment}
                            onStartAssessment={onStartAssessment}
                        />
                    ))
                ) : (
                    <div className="p-6 bg-white rounded-xl shadow-md text-gray-500">
                        No pending assessments. Great job!
                    </div>
                )}
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 border-t pt-6">
                ✅ Completed Assessments ({completedAssessments.length})
            </h2>

            <div className="space-y-4">
                {completedAssessments.map(assessment => (
                    <AssessmentCard key={assessment.id} assessment={assessment} />
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
