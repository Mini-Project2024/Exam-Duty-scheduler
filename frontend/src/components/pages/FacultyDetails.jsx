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
      const response = await axios.get("https://exam-duty-scheduler-backend.onrender.com/faculty");
      const facultyData = response.data;

      const deptSet = new Set();
      const facultyByDept = {};

      facultyData.forEach((faculty) => {
        const { dept, name, schedule } = faculty;
        if (dept !== 'CSE') {  // Exclude CSE department
          deptSet.add(dept);
          if (!facultyByDept[dept]) {
            facultyByDept[dept] = {};
          }
          facultyByDept[dept][name] = schedule || [];
        }
      });

      setDepartments(Array.from(deptSet));
      setFaculty(facultyByDept);
    } catch (error) {
      console.error("Error fetching faculty data", error);
    }
  };

  const fetchAssignedDutyData = async (facultyName) => {
    try {
      const response = await axios.get(`https://exam-duty-scheduler-backend.onrender.com/facultyDuty/${facultyName}`);
      const assignedDutyData = response.data;
  
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
      <center><h1 className="text-2xl font-bold my-4 w-full ">Faculty Details</h1></center>
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
          <table className='table-auto w-1/2 my-4'>
            <thead>
              <tr>
                <th className='px-4 py-2 border border-gray-300'>Semester</th>
                <th className='px-4 py-2 border border-gray-300'>Exam Date</th>
                <th className='px-4 py-2 border border-gray-300'>Subject Code</th>
                <th className='px-4 py-2 border border-gray-300'>Subject Name</th>
                <th className='px-4 py-2 border border-gray-300'>Session</th>
              </tr>
            </thead>
            <tbody>
              {assignedDuty.map((entry, index) => (
                <tr key={index}>
                  <td className='px-4 py-2 border border-gray-300 text-center'>{entry.examDateId.semester}</td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>{entry.examDateId.examDate}</td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>{entry.examDateId.subjectcode}</td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>{entry.examDateId.examName}</td>
                  <td className='px-4 py-2 border border-gray-300 text-center'>{entry.examDateId.session}</td>
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