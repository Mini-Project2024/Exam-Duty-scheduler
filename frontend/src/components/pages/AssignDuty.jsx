import React, { useState } from "react";

const AssignDuty = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(""); // Selected faculty
  const facultyList = ["Mr. X", "Ms. Y", "Mr. Z"];

  // Sample dates (replace with your actual date logic)
  const [dates, setDates] = useState([
    {
      date: "2024-06-05",
      assignedFaculty: "",
      assigned: false,
      session: "Morning", // Added session property
    },
    {
      date: "2024-06-06",
      assignedFaculty: "",
      assigned: false,
      session: "Evening",
    },
    { date: "2024-06-07", assignedFaculty: "", assigned: false, session: "Morning" },
    { date: "2024-06-10", assignedFaculty: "", assigned: false, session: "Evening" },
    { date: "2024-06-11", assignedFaculty: "", assigned: false, session: "Morning" },
  ]);

  // Function to handle faculty selection
  const handleFacultyChange = (event, dateIndex) => {
    const updatedDates = [...dates];
    updatedDates[dateIndex].assignedFaculty = event.target.value;
    setDates(updatedDates);
  };

  // Function to handle "Assign" button click for a specific date
  const handleAssign = (dateIndex) => {
    const updatedDates = [...dates];
    const selectedFacultyForDate = updatedDates[dateIndex].assignedFaculty;

    if (!selectedFacultyForDate) {
      console.error("Please select a faculty before assigning.");
      return;
    }

    updatedDates[dateIndex].assigned = !updatedDates[dateIndex].assigned; // Toggle assigned state
    setDates(updatedDates);

    console.log(
      `${JSON.stringify({
        date: dates[dateIndex].date,
        faculty: selectedFacultyForDate,
        session: dates[dateIndex].session,
      })})`,
    );
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
              <td className="px-4 py-2 border border-gray-300">
                {dateObj.date}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {dateObj.session}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <select
                  id={`faculty-${index}`} // Unique ID for each select element
                  value={dateObj.assignedFaculty}
                  onChange={(event) => handleFacultyChange(event, index)}
                >
                  <option value="">-- Select Faculty --</option>
                  {facultyList.map((faculty, index) => (
                    <option key={index} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 border border-gray-300">
                <button
                  className={`text-${
                    dateObj.assigned ? "blue" : "gray"
                  }-500 underline`}
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
