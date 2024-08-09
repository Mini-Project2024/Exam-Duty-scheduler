import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddExamDetails = () => {
  const [examDetails, setExamDetails] = useState({
    examName: "",
    subjectcode:"",
    examDate: "",
    session: "",
    semester: "",
  });
  const [message, setMessage] = useState("");
  const [examData, setExamData] = useState([]);
  // const [subjectcode, setSubjectcode] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [semesters] = useState(["1", "2", "3", "4", "5", "6", "7", "8"]);

  const handleChange = (e) => {
    setExamDetails({
      ...examDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingExam = await axios.get("https://exam-duty-scheduler-backend.onrender.com/checkExamDate", {
        params: {
          examDate: examDetails.examDate,
          subjectcode: examDetails.subjectcode, 
          semester: examDetails.semester,
          session: examDetails.session,
        },
      });

      if (existingExam.data && existingExam.data.examName !== examDetails.examName) {
        toast.error("Exam already exists on this date, semester, and session.");
        return;
      }

      const response = await axios.post("https://exam-duty-scheduler-backend.onrender.com/addExamdate", examDetails);
      console.log("Exam details added:", response.data);
      toast.success("Exam details added successfully!");
      setTimeout(() => {
        resetForm();
        fetchExamData();
      }, 2000);
    } catch (error) {
      console.error("Error adding exam details:", error);
      toast.error("Error adding exam details.");
    }
  };

  const resetForm = () => {
    setExamDetails({ examName: "",subjectcode:"", examDate: "", session: "", semester: "" });
    setMessage("");
    setSelectedExam(null);
  };

  const fetchExamData = async () => {
    try {
      const response = await axios.get("https://exam-duty-scheduler-backend.onrender.com/getExamDetails");
      setExamData(response.data);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setMessage("Error fetching exam data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://exam-duty-scheduler-backend.onrender.com/deleteExamDate/${id}`);
      toast.success("Exam details deleted successfully!");
      fetchExamData();
    } catch (error) {
      console.error("Error deleting exam details:", error);
      toast.error("Error deleting exam details.");
    }
  };

  const handleUpdate = (exam) => {
    setExamDetails({
      examName: exam.examName,
      subjectcode: exam.subjectcode,
      examDate: exam.examDate,
      session: exam.session,
      semester: exam.semester,
    });
    setSelectedExam(exam);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://exam-duty-scheduler-backend.onrender.com/updateExamDate/${selectedExam._id}`,
        examDetails
      );
      console.log("Exam details updated:", response.data);
      toast.success("Exam details updated successfully!");
      setTimeout(() => {
        resetForm();
        fetchExamData();
      }, 2000);
    } catch (error) {
      console.error("Error updating exam details:", error);
      toast.error("Error updating exam details.");
    }
  };

  useEffect(() => {
    fetchExamData();
  }, []);

  return (
    <section className="min-h-screen flex flex-col gap-4 items-center justify-center p-5 bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {selectedExam ? "Update Exam Details" : "Add Exam Details"}
        </h1>
        <form
          onSubmit={selectedExam ? handleUpdateSubmit : handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Exam Name:
            </label>
            <input
              type="text"
              name="examName"
              value={examDetails.examName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Subject Code:
            </label>
            <input
              type="text"
              name="subjectcode"
              value={examDetails.subjectcode}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Exam Date:
            </label>
            <input
              type="date"
              name="examDate"
              value={examDetails.examDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Session:
            </label>
            <select
              name="session"
              value={examDetails.session}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">-- Select Session --</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Semester:
            </label>
            <select
              name="semester"
              value={examDetails.semester}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">-- Select Semester --</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {selectedExam ? "Update Exam" : "Add Exam"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-500">{message}</p>
        )}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">All Exams</h1>
        <table className="table-auto w-full my-4">
          <thead>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Exam Name</th>
              <th className="px-4 py-2 border border-gray-300">Subject Code</th>
              <th className="px-4 py-2 border border-gray-300">Exam Date</th>
              <th className="px-4 py-2 border border-gray-300">Session</th>
              <th className="px-4 py-2 border border-gray-300">Semester</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {examData.map((exam) => (
              <tr key={exam._id}>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {exam.examName}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {exam.subjectcode}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {exam.examDate}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {exam.session}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {exam.semester}
                </td>
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => handleDelete(exam._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={() => handleUpdate(exam)}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AddExamDetails;
