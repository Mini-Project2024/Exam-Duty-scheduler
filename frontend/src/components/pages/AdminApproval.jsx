import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AdminExchangeRequests = () => {
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRequests = async () => {
      try {
        const response = await axios.get('https://exam-duty-scheduler-backend.onrender.com/admin/exchangeRequestslist', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Admin token
          },
        });
        console.log("Exchange Requests Data:", response.data); // Check the structure
        setExchangeRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching exchange requests:', error);
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchExchangeRequests();
  }, []);
  

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.put(`https://exam-duty-scheduler-backend.onrender.com/admin/approveExchangeRequest/${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Exchange request approved successfully');
      setExchangeRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: 'Approved' } : request
        )
      );
    } catch (error) {
      console.error('Error approving exchange request:', error);
      toast.error('Failed to approve exchange request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.put(`https://exam-duty-scheduler-backend.onrender.com/admin/rejectExchangeRequest/${requestId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      toast.success('Exchange request rejected successfully');
      setExchangeRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId ? { ...request, status: 'Rejected' } : request
        )
      );
    } catch (error) {
      console.error('Error rejecting exchange request:', error);
      toast.error('Failed to reject exchange request');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Admin Exchange Requests</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exam Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested Faculty
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requested Session
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exchange Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exchange Faculty
              </th>
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exchange Session
              </th>
              {/* <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th> */}
              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              {/* <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th> */}
            </tr>
          </thead>
          <tbody>
            {exchangeRequests.map((request) => (
              <tr key={request._id} className="bg-white">
               <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                   {request.originalAssignment?.examDateId?.examName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                   {request.originalAssignment?.examDateId?.examDate || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.originalAssignment?.facultyId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.originalAssignment?.session || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.exchangeDateId?.examDate || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.exchangeFacultyId?.name || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.exchangeSession || "N/A"}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.status}
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {request.status === 'Pending' ? (
                    <div>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300 mr-2"
                        onClick={() => handleApproveRequest(request._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                        onClick={() => handleRejectRequest(request._id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-md text-white ${
                        request.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    >
                      {request.status}
                    </span>
                  )}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap border-b border-gray-200">
                  {new Date(request.createdAt).toLocaleString()}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminExchangeRequests;
