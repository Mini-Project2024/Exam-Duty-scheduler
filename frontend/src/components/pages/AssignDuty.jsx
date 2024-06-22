import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AssignDuty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [dates, setDates] = useState([]);

  const fetchData = async () => {
    try {
      const [facultyResponse, datesResponse, assignedResponse] =
        await Promise.all([
          axios.get("http://localhost:3106/faculty"),
          axios.get("http://localhost:3106/getExamDetails"),
          axios.get("http://localhost:3106/assignedFaculty"),
        ]);
        console.log(assignedResponse)
      const facultyData = facultyResponse.data.filter(
        (faculty) => faculty.name.toLowerCase() !== "myadmin"
      );
      setFacultyList(facultyData);

      const assignedFaculty = assignedResponse.data;

      const examDetails = datesResponse.data.map((exam) => {
        const assignment = assignedFaculty.find(
          (assign) =>
            assign.examDateId &&
            assign.examDateId._id === exam._id &&
            assign.session === exam.session
        );

        if (assignment) {
          const faculty = facultyData.find(
            (faculty) => faculty._id === assignment.facultyId._id
          );
          return {
            ...exam,
            assignedFaculty: assignment.facultyId._id,
            assignedFacultyName: faculty ? faculty.name : "",
            assigned: true,
          };
        } else {
          return {
            ...exam,
            assignedFaculty: "",
            assigned: false,
          };
        }
      });

      examDetails.sort((a, b) => b.semester - a.semester);

      setDates(examDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFacultyChange = (event, dateIndex) => {
    const updatedDates = [...dates];
    const selectedFaculty = facultyList.find(
      (faculty) => faculty._id === event.target.value
    );
    updatedDates[dateIndex].assignedFaculty = selectedFaculty._id;
    updatedDates[dateIndex].assignedFacultyName = selectedFaculty.name;
    setDates(updatedDates);
  };

  const handleAssign = async (dateIndex) => {
    const selectedFacultyForDate = dates[dateIndex].assignedFaculty;

    if (!selectedFacultyForDate) {
      toast.error("Please select a faculty before assigning.");
      return;
    }

    const isAlreadyAssigned = dates.some((date, index) => {
      if (index !== dateIndex) {
        return (
          date.assignedFaculty === selectedFacultyForDate &&
          date.examDate === dates[dateIndex].examDate &&
          date.session === dates[dateIndex].session
        );
      }
      return false;
    });
  
    if (isAlreadyAssigned) {
      toast.error("Faculty is already assigned to this date and session.");
      return;
    }
    
    const updatedDates = [...dates];
    const assignedFacultyName = updatedDates[dateIndex].assignedFacultyName;

    try {
      await axios.post("http://localhost:3106/assignDuty", {
        examDateId: updatedDates[dateIndex]._id,
        facultyId: selectedFacultyForDate,
        facultyName: assignedFacultyName,
        session: updatedDates[dateIndex].session,
        semester: updatedDates[dateIndex].semester,
        subject: updatedDates[dateIndex].examName, // Assuming examName is the subject field
      });

      updatedDates[dateIndex].assigned = true;
      setDates(updatedDates);
      toast.success("Duty assigned successfully");
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
                {new Date(dateObj.examDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.examName}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.semester}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.session}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <select
                  id={`faculty-${index}`}
                  value={dateObj.assignedFaculty}
                  onChange={(event) => handleFacultyChange(event, index)}
                  disabled={dateObj.assigned}
                >
                  {!dateObj.assigned ? (
                    <>
                      <option value="">-- Select Faculty --</option>
                      {facultyList.map((faculty) => (
                        <option key={faculty._id} value={faculty._id}>
                          {faculty.name}
                        </option>
                      ))}
                    </>
                  ) : (
                    <option value={dateObj.assignedFaculty} disabled>
                      {dateObj.assignedFacultyName}
                    </option>
                  )}
                </select>
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <button
                  className={`text-${dateObj.assigned ? "blue" : "gray"}-500 ${
                    dateObj.assigned ? "bg-[#4bb543]" : "bg-[#3572EF]"
                  } border-white text-white font-bold rounded-md px-4 py-2 w-24`}
                  onClick={() => handleAssign(index)}
                  disabled={!dateObj.assignedFaculty || dateObj.assigned}
                >
                  {dateObj.assigned ? `Assigned` : "Assign"}
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
