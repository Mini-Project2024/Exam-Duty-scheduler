import { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyDetails = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [schedule, setSchedule] = useState({});
  const [faculty, setFaculty] = useState({});

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get("http://localhost:3106/faculty");
      const facultyData = response.data;

      const deptSet = new Set();
      const facultyByDept = {};

      facultyData.forEach((faculty) => {
        const { dept, name } = faculty;
        deptSet.add(dept);
        if (!facultyByDept[dept]) {
          facultyByDept[dept] = {};
        }
        facultyByDept[dept][name] = faculty.schedule || {}; // Adjust this line if your faculty data structure is different
      });

      setDepartments(Array.from(deptSet));
      setFaculty(facultyByDept);
    } catch (error) {
      console.error("Error fetching faculty data", error);
    }
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedFaculty('');
    setSchedule({});
  };

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    const facultySchedule = faculty[selectedDepartment]?.[event.target.value];
    setSchedule(facultySchedule || {});
  };

  const filteredFaculty = selectedDepartment && faculty[selectedDepartment];

  return (
    <div className="faculty-details w-full">
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
      {selectedDepartment && selectedFaculty && schedule.date && schedule.session && (
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
