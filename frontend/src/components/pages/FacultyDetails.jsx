import React, { useState } from 'react';

const FacultyDetails = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [schedule, setSchedule] = useState({}); // State to store schedule data

  const departments = ['CSE', 'CSD']; // Replace with your actual department names
  const faculty = {
    CSE: {
      'Professor John Doe': {
        date: ['2024-06-06','2024-06-07','2024-06-07'], // Replace with actual date
        session: ['Morning','Noon','Morning','Noon'],
      },
      'Professor Jane Smith': {
        date: ['2024-06-06','2024-06-07','2024-06-07'], // Replace with actual date
        session:['Morning','Noon','Morning','Noon'],
      },
    },
    CSD: {
      'Professor Michael Lee': {
        date: ['2024-06-07','2024-06-07','2024-06-07'], // Replace with actual date
        session: ['Morning','Noon','Morning','Noon'],
      },
      'Professor Sarah Jones': {
        date:['2024-06-06','2024-06-07','2024-06-07'], // Replace with actual date
        session: ['Morning','Noon','Morning','Noon'],
      },
    },
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedFaculty(''); // Clear faculty selection when department changes
    setSchedule({}); // Clear schedule when department changes
  };

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    const facultySchedule = faculty[selectedDepartment]?.[event.target.value];
    setSchedule(facultySchedule || {}); // Set schedule if available, otherwise empty object
  };

  const filteredFaculty = selectedDepartment && faculty[selectedDepartment];

  return (
    <div className="faculty-details w-full ">
      <h1 className="text-2xl font-bold mb-4 w-full">Faculty Details</h1>
      <div className='flex justify-center gap-8'>
      <div className="department-select mb-4">
        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          className="appearance-none border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Department</option>
          {departments.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>
      </div>
      {selectedDepartment && (
        <div className="faculty-select mb-4">
          <select
            value={selectedFaculty}
            onChange={handleFacultyChange}
            className="appearance-none border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Faculty (within {selectedDepartment})</option>
            {filteredFaculty &&
              Object.keys(filteredFaculty).map((facultyName) => (
                <option key={facultyName} value={facultyName}>
                  {facultyName}
                </option>
              ))}
          </select>
        </div>
      )}
      </div>
      {selectedDepartment && selectedFaculty && schedule.date && schedule.session && ( // Only show table if both options are selected and schedule exists
        <center>
          <table className='border-2 border-gray-900 rounded'>
            <thead>
              <tr>
                <th className='p-5 border-2 border-gray-900 rounded'>Date</th>
                <th className='p-5 border-2 border-gray-900 rounded'>Session</th>
              </tr>
            </thead>
            <tbody>
              {schedule.date.map((date, index) => (
                <tr key={index}>
                  <td className='p-5 border-2 border-gray-900 rounded'>{date}</td>
                  <td className='p-5 border-2 border-gray-900 rounded'>{schedule.session[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </center>
      )}
    </div>
  );
};

export default FacultyDetails;
