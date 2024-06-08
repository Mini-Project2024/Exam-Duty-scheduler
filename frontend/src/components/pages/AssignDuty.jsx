import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AssignDuty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    // Fetch faculty data
    const fetchFacultyData = async () => {
      try {
        const response = await axios.get("http://localhost:3106/faculty");
        setFacultyList(response.data);
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    // Fetch exam dates data
    const fetchDatesData = async () => {
      try {
        const response = await axios.get("http://localhost:3106/getExamDetails");
        const examDetails = response.data.map((exam) => ({
          date: exam.examDate,
          session: exam.session,
          assignedFaculty: "",
          assigned: false,
        }));
        setDates(examDetails);
      } catch (error) {
        console.error("Error fetching exam dates data:", error);
      }
    };

    // Fetch assigned faculty details
    const fetchAssignedFaculty = async () => {
      try {
        const response = await axios.get("http://localhost:3106/assignedFaculty");
        const assignedFaculty = response.data;
        
        // Update dates state based on assigned faculty
        const updatedDates = [...dates];
        assignedFaculty.forEach((assignment) => {
          // Convert the date string to Date object for comparison
          const assignmentDate = new Date(assignment.date);
          
          // Find the index of the date in updatedDates
          const dateIndex = updatedDates.findIndex(date => {
            // Convert the date string to Date object for comparison
            const currentDate = new Date(date.date);
            // Compare the dates
            return currentDate.toDateString() === assignmentDate.toDateString();
          });
          
          // If the date is found, update the assigned status
          if (dateIndex !== -1) {
            updatedDates[dateIndex].assigned = true;
          }
        });
        setDates(updatedDates);
      } catch (error) {
        console.error("Error fetching assigned faculty details:", error);
      }
    };
    
    fetchFacultyData();
    fetchDatesData();
    fetchAssignedFaculty();
  }, []);

  // Function to handle faculty selection
  const handleFacultyChange = (event, dateIndex) => {
    const updatedDates = [...dates];
    updatedDates[dateIndex].assignedFaculty = event.target.value;
    setDates(updatedDates);
  };

  // Function to handle "Assign" button click for a specific date
 // Function to handle "Assign" button click for a specific date
const handleAssign = async (dateIndex) => {
  const selectedFacultyForDate = dates[dateIndex].assignedFaculty;

  if (!selectedFacultyForDate) {
    toast.error("Please select a faculty before assigning.");
    return;
  }

  const updatedDates = [...dates];
  updatedDates[dateIndex].assigned = true; // Set assigned to true
  setDates(updatedDates);

  try {
    // Update the server with the new assigned status
    const response = await axios.post("http://localhost:3106/assignDuty", {
      date: updatedDates[dateIndex].date,
      faculty: selectedFacultyForDate,
      session: updatedDates[dateIndex].session,
    });

    console.log("Assignment saved:", response.data);
  } catch (error) {
    console.error("Error assigning duty:", error);
  }
};

  return (
    <section className="w-full h-full flex flex-col items-center p-4">
      <h1 className="text-2xl mb-4">Assign Duty</h1>

      {/* Table */}
      <table className="table-auto w-full my-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Date</th>
            <th className="px-4 py-2 border border-gray-300">Session</th>
            <th className="px-4 py-2 border border-gray-300">Faculty</th>
            <th className="px-4 py-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((dateObj, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border border-gray-300">{dateObj.date}</td>
              <td className="px-4 py-2 border border-gray-300">{dateObj.session}</td>
              <td className="px-4 py-2 border border-gray-300">
                <select
                  id={`faculty-${index}`} // Unique ID for each select element
                  value={dateObj.assignedFaculty}
                  onChange={(event) => handleFacultyChange(event, index)}
                >
                  <option value="">-- Select Faculty --</option>
                  {facultyList.map((faculty) => (
                    <option key={faculty._id} value={faculty.name}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className={`text-${dateObj.assigned ? "blue" : "gray"}-500 underline`}
                  onClick={() => handleAssign(index)}
                  disabled={!dateObj.assignedFaculty} // Disable button if no faculty selected
                >
                  {dateObj.assigned ? "Assigned" : "Assign"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AssignDuty;
