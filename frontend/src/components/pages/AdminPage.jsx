import React, { useState } from 'react';

const AdminPage = () => {
  // State to store faculty members
  const [facultyList, setFacultyList] = useState([]);

  // State to store selected faculty
  const [selectedFaculty, setSelectedFaculty] = useState('');

  // State to store selected date
  const [selectedDate, setSelectedDate] = useState('');

  // State to store history of work done
  const [workHistory, setWorkHistory] = useState({});

  // Function to handle adding a faculty member
  const addFaculty = (facultyName) => {
    setFacultyList([...facultyList, facultyName]);
  };

  // Function to handle incrementing work done for selected faculty on selected date
  const incrementWorkDone = () => {
    // Check if selected faculty and date are not empty
    if (selectedFaculty && selectedDate) {
      // Update work history
      const updatedHistory = { ...workHistory };
      if (!updatedHistory[selectedFaculty]) {
        updatedHistory[selectedFaculty] = {};
      }
      if (!updatedHistory[selectedFaculty][selectedDate]) {
        updatedHistory[selectedFaculty][selectedDate] = 0;
      }
      updatedHistory[selectedFaculty][selectedDate]++;
      setWorkHistory(updatedHistory);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      {/* Dropdown to select faculty */}
      <select onChange={(e) => setSelectedFaculty(e.target.value)}>
        <option value="">Select Faculty</option>
        {facultyList.map((faculty, index) => (
          <option key={index} value={faculty}>
            {faculty}
          </option>
        ))}
      </select>
      <br />
      {/* Input field to add new faculty */}
      <input type="text" placeholder="Add Faculty" onKeyDown={(e) => e.key === 'Enter' && addFaculty(e.target.value)} />
      <br />
      {/* Date picker to select date */}
      <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
      <br />
      {/* Button to increment work done */}
      <button onClick={incrementWorkDone}>Increment Work Done</button>
      {/* Display work history */}
      <div>
        <h2>Work History</h2>
        <ul>
          {Object.entries(workHistory).map(([faculty, dates]) => (
            <li key={faculty}>
              <strong>{faculty}</strong>
              <ul>
                {Object.entries(dates).map(([date, count]) => (
                  <li key={date}>
                    {date}: {count}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;