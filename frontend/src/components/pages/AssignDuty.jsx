import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AssignDuty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const facultyResponse = await axios.get(
          "http://localhost:3106/faculty"
        );

        const filteredFacultyList = facultyResponse.data.filter(
          (faculty) => faculty.name.toLowerCase() !== "myadmin"
        );
        setFacultyList(filteredFacultyList);

        const datesResponse = await axios.get(
          "http://localhost:3106/getExamDetails"
        );
        const examDetails = datesResponse.data.map((exam) => ({
          date: exam.examDate,
          subject: exam.examName,
          semester: exam.semester,
          session: exam.session,
          assignedFaculty: "",
          assigned: false,
        }));

        const assignedResponse = await axios.get(
          "http://localhost:3106/assignedFaculty"
        );
        const assignedFaculty = assignedResponse.data;

        const updatedDates = examDetails.map((dateObj) => {
          const assignment = assignedFaculty.find(
            (assign) =>
              new Date(assign.date).toISOString() ===
              new Date(dateObj.date).toISOString()
          );
          if (assignment) {
            return {
              ...dateObj,
              assigned: true,
              assignedFaculty: assignment.faculty,
            };
          }
          return dateObj;
        });

        // Sort the dates by semester in ascending order
        updatedDates.sort((a, b) => b.semester - a.semester);

        setDates(updatedDates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleFacultyChange = (event, dateIndex) => {
    const updatedDates = [...dates];
    updatedDates[dateIndex].assignedFaculty = event.target.value;
    setDates(updatedDates);
  };

  const handleAssign = async (dateIndex) => {
    const selectedFacultyForDate = dates[dateIndex].assignedFaculty;

    if (!selectedFacultyForDate) {
      toast.error("Please select a faculty before assigning.");
      return;
    }

    const updatedDates = [...dates];
    updatedDates[dateIndex].assigned = true;
    setDates(updatedDates);

    try {
      const response = await axios.post("http://localhost:3106/assignDuty", {
        date: updatedDates[dateIndex].date,
        faculty: selectedFacultyForDate,
        session: updatedDates[dateIndex].session,
        semester: updatedDates[dateIndex].semester,
      });

      toast.success("Duty assigned successfully");
      console.log("Assignment saved:", response.data);
    } catch (error) {
      console.error("Error assigning duty:", error);
      toast.error("Error assigning duty");
    }
  };

  return (
    <section className="w-full h-full flex flex-col items-center p-4">
      <Toaster />
      <h1 className="text-2xl mb-4">Assign Duty</h1>

      <table className="table-auto w-full my-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Date</th>
            <th className="px-4 py-2 border border-gray-300">Subject</th>
            <th className="px-4 py-2 border border-gray-300">Semester</th>
            <th className="px-4 py-2 border border-gray-300">Session</th>
            <th className="px-4 py-2 border border-gray-300">Faculty</th>
            <th className="px-4 py-2 border border-gray-300">Action</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((dateObj, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {new Date(dateObj.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.subject}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.semester}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.session}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center justify-center">
                <select
                  id={`faculty-${index}`}
                  value={dateObj.assignedFaculty}
                  onChange={(event) => handleFacultyChange(event, index)}
                  disabled={dateObj.assigned}
                >
                  <option value="">-- Select Faculty --</option>
                  {facultyList.map((faculty) => (
                    <option key={faculty._id} value={faculty.name}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <button
                  className={`text-${
                    dateObj.assigned ? "blue" : "gray"
                  }-500 bg-[#3572EF] border-white text-white font-bold rounded-md px-4 py-2 w-24`}
                  onClick={() => handleAssign(index)}
                  disabled={!dateObj.assignedFaculty || dateObj.assigned}
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
