export const MOCK_DATA = {
    students: [
        { id: 'S001', name: 'Alice Johnson', email: 'alice.j@school.com', grade: '10A' },
        { id: 'S002', name: 'Bob Smith', email: 'bob.s@school.com', grade: '9B' },
        { id: 'S003', name: 'Charlie Brown', email: 'charlie.b@school.com', grade: '10A' },
    ],
    teachers: [
        { id: 'T001', name: 'Mr. David Lee', email: 'david.l@school.com', subject: 'Mathematics' },
        { id: 'T002', name: 'Ms. Emily Chen', email: 'emily.c@school.com', subject: 'Physics' },
    ],
    exams: [
        { id: 1, title: 'Mathematics Final Exam', subject: 'Mathematics', questions: 30, totalStudents: 45, submitted: 42, avgScore: '78%', status: 'Active' },
        { id: 2, title: 'Physics Midterm', subject: 'Physics', questions: 25, totalStudents: 38, submitted: 35, avgScore: '72%', status: 'Active' },
        { id: 3, title: 'Chemistry Quiz', subject: 'Chemistry', questions: 15, totalStudents: 40, submitted: 40, avgScore: '85%', status: 'Ended' },
    ],
    // --- NEW MOCK DATA: Detailed Exam Results ---
    examResults: {
        1: [ // Mathematics Final Exam (ID: 1)
            { studentId: 'S001', name: 'Alice Johnson', score: 85, total: 100, status: 'Completed', grade: 'A' },
            { studentId: 'S002', name: 'Bob Smith', score: 72, total: 100, status: 'Completed', grade: 'B' },
            { studentId: 'S003', name: 'Charlie Brown', score: 91, total: 100, status: 'Completed', grade: 'A+' },
            { studentId: 'S004', name: 'Diana Prince', score: 65, total: 100, status: 'Completed', grade: 'C' },
            { studentId: 'S005', name: 'Ethan Hunt', score: null, total: 100, status: 'Not Started', grade: 'N/A' },
        ],
        2: [ // Physics Midterm (ID: 2)
            { studentId: 'S001', name: 'Alice Johnson', score: 78, total: 100, status: 'Completed', grade: 'B+' },
            { studentId: 'S004', name: 'Diana Prince', score: 95, total: 100, status: 'Completed', grade: 'A+' },
        ],
    },
    studentAssessments: [
        { id: 101, title: 'Algebra Unit Test', subject: 'Mathematics', teacher: 'Mr. David Lee', totalMarks: 50, dueDate: '2025-12-15', timeLimit: '60 mins', status: 'Pending' },
        { id: 102, title: 'Electromagnetism Quiz', subject: 'Physics', teacher: 'Ms. Emily Chen', totalMarks: 20, dueDate: '2025-12-01', timeLimit: '30 mins', status: 'Completed' },
        { id: 103, title: 'The French Revolution Essay', subject: 'History', teacher: 'Ms. A. Sharma', totalMarks: 100, dueDate: '2025-11-20', timeLimit: 'N/A', status: 'Pending' },
    ]
};