import React, { useState } from 'react';

const MOCK_QUESTIONS = [
    { id: 1, text: "What is the primary function of the mitochondria?", options: ["Photosynthesis", "Protein synthesis", "Energy production", "Cell division"], answer: "Energy production" },
    { id: 2, text: "Which element has the atomic number 6?", options: ["Oxygen", "Nitrogen", "Carbon", "Boron"], answer: "Carbon" },
    { id: 3, text: "If y = 3x + 2, what is y when x = 4?", options: ["12", "14", "10", "15"], answer: "14" },
];

const AssessmentView = ({ assessment, onFinishAssessment }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = MOCK_QUESTIONS[currentQuestionIndex];
    const totalQuestions = MOCK_QUESTIONS.length;

    const handleAnswerSelect = (questionId, selectedOption) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = () => {
        let finalScore = 0;
        MOCK_QUESTIONS.forEach(q => {
            if (answers[q.id] === q.answer) finalScore++;
        });
        setScore(finalScore);
        setShowResult(true);
    };

    if (showResult) {
        return (
            <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-2xl space-y-6 mt-10">
                <h2 className="text-3xl font-bold text-green-600 text-center">Assessment Completed! 🎉</h2>
                <div className="border-t border-b py-4 text-center">
                    <p className="text-xl text-gray-800">Your Score:</p>
                    <p className="text-5xl font-extrabold text-indigo-600 mt-2">{score}/{totalQuestions}</p>
                    <p className="text-sm text-gray-500 mt-2">({Math.round((score / totalQuestions) * 100)}% Correct)</p>
                </div>
                <p className="text-center text-gray-700">Thank you for submitting the <b>{assessment.title}</b>.</p>
                <div className="flex justify-center">
                    <button
                        onClick={onFinishAssessment}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{assessment.title}</h1>

            <div className="flex justify-between items-center p-4 bg-indigo-50 border-l-4 border-indigo-600 rounded-lg shadow-md">
                <p className="font-semibold text-lg text-indigo-800">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </p>
                <p className="text-md text-indigo-700">Time Limit: {assessment.timeLimit} (Mock Timer)</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <p className="text-xl font-medium text-gray-800">{currentQuestion.text}</p>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <div
                            key={index}
                            onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                            className={`p-4 border rounded-lg cursor-pointer transition duration-150 
                                ${answers[currentQuestion.id] === option 
                                    ? 'bg-indigo-100 border-indigo-500 shadow-inner' 
                                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                                }`}
                        >
                            <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                            {option}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md disabled:opacity-50 transition"
                >
                    Previous
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                    <button
                        onClick={handleNext}
                        disabled={!answers[currentQuestion.id]}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={!answers[currentQuestion.id]}
                        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-green-400 transition"
                    >
                        Submit Assessment
                    </button>
                )}
            </div>
        </div>
    );
};

export default AssessmentView;
