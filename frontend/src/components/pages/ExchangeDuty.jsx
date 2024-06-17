import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ExchangeDuty = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeFormVisible, setExchangeFormVisible] = useState(false);
  const [exchangeDateId, setExchangeDateId] = useState('');
  const [exchangeFacultyId, setExchangeFacultyId] = useState('');
  const [exchangeSession, setExchangeSession] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3106/exchangeDuty', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleExchangeRequest = async (assignmentId) => {
    try {
      // Toggle the exchange form visibility
      setExchangeFormVisible(true);
    } catch (err) {
      toast.error('Failed to request exchange.');
      console.error(err.message);
    }
  };

  const handleSubmitExchange = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await axios.post(`http://localhost:3106/requestExchange/${selectedAssignmentId}`, {
        exchangeDateId,
        exchangeFacultyId,
        exchangeSession
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success(response.data.message);
      // Optionally, you can refresh assignments or update UI after successful exchange
      // Example: Fetch updated assignments list
      // fetchUserDetails();
      
      // Hide the exchange form after successful exchange
      setExchangeFormVisible(false);
    } catch (err) {
      toast.error('Failed to request exchange.');
      console.error(err.message);
    }
  };

  const handleCancelExchange = () => {
    setExchangeFormVisible(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">My Duty Assignments</h1>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Date
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="bg-white">
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {assignment.examDateId.examName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {assignment.examDateId.examDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {assignment.examDateId.semester}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {assignment.examDateId.session}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    {assignment.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                      onClick={() => handleExchangeRequest(assignment._id)}
                    >
                      Request Exchange
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Exchange Form */}
      {exchangeFormVisible && (
        <div className="mt-4 border border-gray-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Exchange Duty</h2>
          <form onSubmit={handleSubmitExchange}>
            <div className="mb-2">
              <label htmlFor="exchangeDateId" className="block text-sm font-medium text-gray-700">Exchange Date ID:</label>
              <input type="text" id="exchangeDateId" value={exchangeDateId} onChange={(e) => setExchangeDateId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>
            <div className="mb-2">
              <label htmlFor="exchangeFacultyId" className="block text-sm font-medium text-gray-700">Exchange Faculty ID:</label>
              <input type="text" id="exchangeFacultyId" value={exchangeFacultyId} onChange={(e) => setExchangeFacultyId(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>
            <div className="mb-4">
              <label htmlFor="exchangeSession" className="block text-sm font-medium text-gray-700">Exchange Session:</label>
              <input type="text" id="exchangeSession" value={exchangeSession} onChange={(e) => setExchangeSession(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required />
            </div>
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Save and Exchange</button>
              <button type="button" onClick={handleCancelExchange} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md ml-2 hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-500">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExchangeDuty;
