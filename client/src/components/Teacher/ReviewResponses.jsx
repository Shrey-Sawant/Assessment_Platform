// src/components/Teacher/ReviewResponses.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Alert from '../Shared/Alert';
import DataCard from '../Shared/DataCard';
import { useAuth } from '../../context/AuthContext';

const ReviewResponses = () => {
  const { user } = useAuth();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [reviewData, setReviewData] = useState({ FinalScore: '', Comments: '' });
  const [isReviewing, setIsReviewing] = useState(false);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      // Fetch all responses, potentially filterable by exam_id or student_id if implemented
      const response = await api.get('/students/responses');
      setResponses(response.data.data);
    } catch (error) {
      setResponses([]);
      setAlert({ message: error.response?.data?.message || 'Failed to fetch student responses.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleReviewClick = (response) => {
    setSelectedResponse(response);
    setReviewData({ 
        FinalScore: response.Score || '', 
        Comments: '' 
    });
    setIsReviewing(true);
  };

  const handleReviewChange = (e) => {
    setReviewData({ ...reviewData, [e.target.name]: e.target.value });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setAlert({ message: '', type: '' });
    
    if (!selectedResponse?.ResponseID || !reviewData.FinalScore) {
        setAlert({ message: "Response ID and Final Score are required.", type: 'error' });
        return;
    }

    try {
      await api.post('/teachers/reviewedResponses', {
        ResponseID: selectedResponse.ResponseID,
        ReviewedByTeacher: user?.id, 
        FinalScore: Number(reviewData.FinalScore),
        Comments: reviewData.Comments
      });

      setAlert({ message: 'Response reviewed and updated successfully!', type: 'success' });
      setIsReviewing(false);
      setSelectedResponse(null);
      fetchResponses(); // Refresh the list
    } catch (error) {
      setAlert({ message: error.response?.data?.message || 'Review submission failed.', type: 'error' });
    }
  };
  
  const renderResponseDetails = (responsesString) => {
    try {
      const parsed = JSON.parse(responsesString);
      return (
        <ul className="list-disc pl-5 text-sm space-y-1 mt-2 max-h-40 overflow-y-auto bg-gray-100 p-3 rounded">
          {parsed.map((res, i) => (
            <li key={i} className='break-words'>
              <span className="font-medium">{res.q}:</span> {res.ans}
            </li>
          ))}
        </ul>
      );
    } catch (e) {
      return <p className="text-red-500 text-sm">Error parsing responses.</p>;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Review Student Responses</h2>
      <Alert message={alert.message} type={alert.type} />
      
      {isReviewing && selectedResponse && (
        <DataCard title={`Reviewing Response ID: ${selectedResponse.ResponseID}`} className="mb-6 border-2 border-indigo-500">
            <h3 className="text-lg font-semibold mb-2">Student: {selectedResponse.StudentFName} {selectedResponse.StudentLName}</h3>
            <p className="mb-4">Exam: {selectedResponse.ExamTitle}</p>
            
            <h4 className='font-bold mb-2'>Submitted Answers:</h4>
            {renderResponseDetails(selectedResponse.Responses)}
            
            <form onSubmit={submitReview} className="mt-4 space-y-3">
                <div>
                    <label className="block text-gray-700">Final Score</label>
                    <input
                        type="number"
                        name="FinalScore"
                        value={reviewData.FinalScore}
                        onChange={handleReviewChange}
                        required
                        className="w-full border p-2 rounded"
                        placeholder="Enter final score"
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Comments (Optional)</label>
                    <textarea 
                        name="Comments" 
                        value={reviewData.Comments} 
                        onChange={handleReviewChange} 
                        className="w-full border p-2 rounded" 
                        rows="3"
                    />
                </div>
                <div className='flex space-x-2'>
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                        Submit Review
                    </button>
                    <button type="button" onClick={() => setIsReviewing(false)} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
                        Cancel
                    </button>
                </div>
            </form>
        </DataCard>
      )}

      <DataCard title="Submitted Responses List">
        {loading ? (
          <p>Loading...</p>
        ) : responses.length === 0 ? (
          <p>No student responses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Student</th>
                  <th className="py-2 px-4 border">Exam</th>
                  <th className="py-2 px-4 border">Score</th>
                  <th className="py-2 px-4 border">Status</th>
                  <th className="py-2 px-4 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((res) => (
                  <tr key={res.ResponseID} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border">{res.ResponseID}</td>
                    <td className="py-2 px-4 border">{res.StudentFName} {res.StudentLName}</td>
                    <td className="py-2 px-4 border">{res.ExamTitle}</td>
                    <td className="py-2 px-4 border">{res.Score || 'N/A'}</td>
                    <td className="py-2 px-4 border">
                      <span className={`px-2 py-1 text-xs rounded-full ${res.IsReviewed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {res.IsReviewed ? 'Reviewed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border">
                      <button 
                        onClick={() => handleReviewClick(res)}
                        className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                      >
                        {res.IsReviewed ? 'Re-Review' : 'Review'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
    </div>
  );
};

export default ReviewResponses;