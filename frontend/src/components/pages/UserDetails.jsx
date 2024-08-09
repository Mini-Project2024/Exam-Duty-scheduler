import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDetails = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from localStorage
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('https://exam-duty-scheduler-backend.onrender.com/assignedFaculty/me', {
          headers: {
            Authorization: `Bearer ${token}` // Include token in the Authorization header
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">My Duty Assignments</h1>
      {assignments.length === 0 ? (
        <p>No assignments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full my-4">
            <thead>
              <tr>
                <th className='px-4 py-2 border border-gray-300'>
                  Exam Name
                </th>
                <th className='px-4 py-2 border border-gray-300'>
                  Exam Date
                </th>
                <th className='px-4 py-2 border border-gray-300'>
                  Semester
                </th>
                <th className='px-4 py-2 border border-gray-300'>
                  Session
                </th>
                {/* <th className='px-4 py-2 border border-gray-300'>
                  Subject
                </th> */}
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="bg-white">
                  <td className='px-4 py-2 border border-gray-300 text-center'>
                    {assignment.examDateId.examName}
                  </td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>
                    {assignment.examDateId.examDate}
                  </td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>
                    {assignment.examDateId.semester}
                  </td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>
                    {assignment.examDateId.session}
                  </td>
                  {/* <td className='px-4 py-2 border border-gray-300 text-center'>
                    {assignment.subject}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
