import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ExchangeDuty = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignedFaculty, setAssignedFaculty] = useState([]);
  const [availableFaculty, setAvailableFaculty] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exchangeFormVisible, setExchangeFormVisible] = useState(false);
  const [exchangeDateId, setExchangeDateId] = useState('');
  const [exchangeFacultyId, setExchangeFacultyId] = useState('');
  const [exchangeSession, setExchangeSession] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');

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

    const fetchAssignedFaculty = async () => {
      try {
        const response = await axios.get('http://localhost:3106/assignedFaculty', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setAssignedFaculty(response.data);
      } catch (err) {
        console.error('Failed to fetch assigned faculty', err);
      }
    };

    fetchUserDetails();
    fetchAssignedFaculty();
  }, []);

  const handleExchangeRequest = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setExchangeFormVisible(true);
  };

  const handleDateChange = (e) => {
    const selectedDateId = e.target.value;
    setExchangeDateId(selectedDateId);

    const facultyForDate = assignedFaculty.filter(faculty => faculty.examDateId._id === selectedDateId);
    setAvailableFaculty(facultyForDate);
    setExchangeFacultyId('');
    setAvailableSessions([]);
  };

  const handleFacultyChange = (e) => {
    const selectedFacultyId = e.target.value;
    setExchangeFacultyId(selectedFacultyId);

    const sessionsForFaculty = assignedFaculty
      .filter(faculty => faculty.facultyId._id === selectedFacultyId && faculty.examDateId._id === exchangeDateId)
      .map(faculty => faculty.examDateId.session);

    setAvailableSessions(sessionsForFaculty);
    setExchangeSession('');
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
  
      // Fetch updated assignments
      const updatedAssignments = await axios.get('http://localhost:3106/exchangeDuty', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAssignments(updatedAssignments.data);
  
      setExchangeFormVisible(false);
    } catch (err) {
      console.error('Failed to request exchange:', err);
      toast.error('Failed to request exchange.');
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
      {exchangeFormVisible && (
        <div className="mt-4 border border-gray-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Exchange Duty</h2>
          <form onSubmit={handleSubmitExchange}>
            <div className="mb-2">
              <label htmlFor="exchangeDateId" className="block text-sm font-medium text-gray-700">Exchange Date:</label>
              <select
                id="exchangeDateId"
                onChange={handleDateChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={exchangeDateId}
                required
              >
                <option value="">Select Date</option>
                {assignedFaculty.map(faculty => (
                  <option key={faculty.examDateId._id} value={faculty.examDateId._id}>
                    {faculty.examDateId.examDate}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="exchangeFacultyId" className="block text-sm font-medium text-gray-700">Exchange Faculty:</label>
              <select
                id="exchangeFacultyId"
                onChange={handleFacultyChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={exchangeFacultyId}
                required
                disabled={!exchangeDateId}
              >
                <option value="">Select Faculty</option>
                {availableFaculty.map(faculty => (
                  <option key={faculty.facultyId._id} value={faculty.facultyId._id}>
                    {faculty.facultyId.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="exchangeSession" className="block text-sm font-medium text-gray-700">Exchange Session:</label>
              <select
                id="exchangeSession"
                onChange={(e) => setExchangeSession(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={exchangeSession}
                required
                disabled={!exchangeFacultyId}
              >
                <option value="">Select Session</option>
                {availableSessions.map((session, index) => (
                  <option key={index} value={session}>
                    {session}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
                onClick={handleCancelExchange}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              >
                Submit Exchange
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ExchangeDuty;
