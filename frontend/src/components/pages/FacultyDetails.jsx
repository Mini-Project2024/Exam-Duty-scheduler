import { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyDetails = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [schedule, setSchedule] = useState([]);
  const [faculty, setFaculty] = useState({});
  const [assignedDuty, setAssignedDuty] = useState([]);

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
        const { dept, name, schedule } = faculty;
        deptSet.add(dept);
        if (!facultyByDept[dept]) {
          facultyByDept[dept] = {};
        }
        facultyByDept[dept][name] = schedule || [];
      });

      setDepartments(Array.from(deptSet));
      setFaculty(facultyByDept);
    } catch (error) {
      console.error("Error fetching faculty data", error);
    }
  };

  const fetchAssignedDutyData = async (facultyName) => {
    try {
      const response = await axios.get(`http://localhost:3106/assignedFaculty?name=${facultyName}`);
      let assignedDutyData = response.data;
      assignedDutyData=assignedDutyData.sort((a, b) => a.semester - b.semester);
      setAssignedDuty(assignedDutyData);
    } catch (error) {
      console.error("Error fetching assigned duty data", error);
    }
  };

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
    setSelectedFaculty('');
    setSchedule([]);
    setAssignedDuty([]);
  };

  const handleFacultyChange = (event) => {
    setSelectedFaculty(event.target.value);
    const facultySchedule = faculty[selectedDepartment]?.[event.target.value];
    setSchedule(facultySchedule || []);
    fetchAssignedDutyData(event.target.value);
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
      {selectedDepartment && selectedFaculty && assignedDuty.length > 0 && (
        <center>
          <table className='border-2 border-gray-900 rounded'>
            <thead>
              <tr>
                <th className='p-5 border-2 border-gray-900 rounded'>Semester</th>
                <th className='p-5 border-2 border-gray-900 rounded'>Exam Date</th>
                <th className='p-5 border-2 border-gray-900 rounded'>Session</th>
              </tr>
            </thead>
            <tbody>
              {assignedDuty.map((entry, index) => (
                <tr key={index}>
                  <td className='p-5 border-2 border-gray-900 rounded'>{entry.semester}</td>
                  <td className='p-5 border-2 border-gray-900 rounded'>{entry.date}</td>
                  <td className='p-5 border-2 border-gray-900 rounded'>{entry.session}</td>
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
