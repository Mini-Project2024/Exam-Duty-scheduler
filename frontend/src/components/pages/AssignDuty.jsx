import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import TextField from "@mui/material/TextField";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { saveAs } from 'file-saver';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

const AssignDuty = () => {
  // const [departments, setDepartments] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [dates, setDates] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState({});

  const [departments, setDepartments] = useState([]);
  const [facultyByDept, setFacultyByDept] = useState({});
  
  const fetchData = async () => {
    try {
      const [facultyResponse, datesResponse, assignedResponse] =
        await Promise.all([
          axios.get("https://exam-duty-scheduler-backend.onrender.com/faculty"),
          axios.get("https://exam-duty-scheduler-backend.onrender.com/getExamDetails"),
          axios.get("https://exam-duty-scheduler-backend.onrender.com/assignedFaculty"),
        ]);
  
      const facultyData = facultyResponse.data.filter(
        (faculty) => faculty.name.toLowerCase() !== "myadmin"
      );
  
      const deptSet = new Set();
      const facultyByDeptObj = {};
  
      facultyData.forEach((faculty) => {
        const { dept, name } = faculty;
        deptSet.add(dept);
        if (!facultyByDeptObj[dept]) {
          facultyByDeptObj[dept] = [];
        }
        facultyByDeptObj[dept].push({ name, _id: faculty._id });
      });
  
      setDepartments(Array.from(deptSet));
      setFacultyByDept(facultyByDeptObj);
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
          const department = faculty.dept; // Add this line to get the department
          return {
            ...exam,
            assignedFaculty: assignment.facultyId._id,
            assignedFacultyName: faculty ? faculty.name : "",
            assignedDepartment: department, // Add this line to include the department
            assigned: true,
          };
        } else {
          return {
            ...exam,
            assignedFaculty: "",
            assignedFacultyName: "",
            assignedDepartment: "", // Add this line to include the department
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

  const handleDepartmentChange = (event, dateIndex) => {
    const selectedDepartment = event.target.value;
    setSelectedDepartments((prevDepartments) => ({...prevDepartments, [dateIndex]: selectedDepartment }));
    if (dates[dateIndex].assigned) {
      setSelectedDepartments((prevDepartments) => ({...prevDepartments, [dateIndex]: dates[dateIndex].assignedDepartment }));
    }
  };

  const handleFacultyChange = (event, dateIndex) => {
    const updatedDates = [...dates];
    const selectedFaculty = facultyList.find(
      (faculty) => faculty._id === event.target.value
    );
    updatedDates[dateIndex].assignedFaculty = selectedFaculty._id;
    updatedDates[dateIndex].assignedFacultyName = selectedFaculty.name;
    setDates(updatedDates);
  };
  // const filteredFaculty = selectedDepartments && faculty[selectedDepartments];

  const handleAssign = async (dateIndex) => {
    const selectedFacultyForDate = dates[dateIndex].assignedFaculty;

    if (!selectedFacultyForDate) {
      toast.error("Please select a faculty before assigning.");
      return;
    }

    const isAlreadyAssigned = dates.some((date, index) => {
      if (index!== dateIndex) {
        return (
          date.assignedFaculty === selectedFacultyForDate &&
          date.examDate === dates[dateIndex].examDate &&
          date.session === dates[dateIndex].session &&
          date.dept === dates[dateIndex].dept
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
      await axios.post("https://exam-duty-scheduler-backend.onrender.com/assignDuty", {
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

  const handleGenerateExcel = async () => {
    try {
      const response = await axios.get("https://exam-duty-scheduler-backend.onrender.com/generateExcel", {
        params: {
          from: fromDate,
          to: toDate,
        },
        responseType: 'blob', // Important: This ensures the response is treated as a blob
      });

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'exam_duties.xlsx');
      setOpen(false);
      toast.success("Excel report generated successfully");
    } catch (error) {
      console.error("Error generating Excel:", error);
      toast.error("Error generating Excel report");
    }
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  return (
    <section className="w-full h-full flex flex-col items-center p-4">
      <Toaster />
      <h1 className="text-2xl mb-4">Assign Duty</h1>

      <table className="table-auto w-full my-4">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Date</th>
            <th className="px-4 py-2 border border-gray-300">Subject</th>
            <th className="px-4 py-2 border border-gray-300">Subject Code</th>
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
                {dateObj.subjectcode}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.semester}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                {dateObj.session}
              </td>
              <td className="px-4 py-2 border border-gray-300 text-center">
  {dateObj.assigned? (
    <span>
      Department: {dateObj.assignedDepartment} <br />
      Faculty: {dateObj.assignedFacultyName}
    </span>
  ) : (
    <>
      <select
        value={selectedDepartments[index] || ""}
        onChange={(event) => handleDepartmentChange(event, index)}
        disabled={dateObj.assigned}
      >
        <option value="">Select Department</option>
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
      {selectedDepartments[index] && (
        <select
          value={dateObj.assignedFaculty}
          onChange={(event) => handleFacultyChange(event, index)}
          disabled={dateObj.assigned}
        >
          <option value="">Select Faculty (within {selectedDepartments[index]})</option>
          {facultyByDept[selectedDepartments[index]].map((faculty) => (
            <option key={faculty._id} value={faculty._id}>
              {faculty.name}
            </option>
          ))}
        </select>
      )}
    </>
  )}
</td>
              <td className="px-4 py-2 border border-gray-300 text-center">
                <button
                  className={`text-${dateObj.assigned ? "blue" : "gray"}-500 ${
                    dateObj.assigned ? "bg-[#4bb543]" : "bg-[#3572EF]"
                  } border-white text-white font-bold rounded-md px-4 py-2 w-24`}
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
      <div className="fixed bottom-4 right-4">
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <Fab variant="extended" color="primary" onClick={handleOpenModal}>
            <DownloadForOfflineIcon sx={{ mr: 1 }} />
            Report
          </Fab>
        </Box>
      </div>

      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{marginBottom: 5}}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ fontWeight: "bold" }}
            >
              Select Date Range for Report
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <TextField
              id="from-date"
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              sx={{ width: "48%" }}
            />
            <TextField
              id="to-date"
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              sx={{ width: "48%" }}
            />
          </Box>
          <Button variant="contained" sx={{ mt: 3 }} onClick={handleGenerateExcel} fullWidth>
            Generate Excel Report
          </Button>
        </Box>
      </Modal>
    </section>
  );
};

export default AssignDuty;