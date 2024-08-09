import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const AddFaculty = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("CS");
  const [message, setMessage] = useState("");
  const [designation, setDesignation] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get("https://exam-duty-scheduler-backend.onrender.com/faculty");
      const sortedData = response.data.sort((a, b) => {
        return new Date(parseInt(b._id.substring(0, 8), 16) * 1000) - new Date(parseInt(a._id.substring(0, 8), 16) * 1000);
      });
      setFacultyData(sortedData);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching faculty data.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFaculty) {
      handleUpdateSubmit();
    } else {
      axios
        .post("https://exam-duty-scheduler-backend.onrender.com/addFaculty", {
          name,
          designation,
          password,
          dept,
        })
        .then((result) => {
          console.log(result);
          toast.success("Faculty member added successfully!");
          setTimeout(() => {
            clearForm();
            fetchFacultyData();
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error adding faculty member.");
        });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://exam-duty-scheduler-backend.onrender.com/deleteFaculty/${id}`);
      toast.success("Faculty member deleted successfully!");
      fetchFacultyData();
    } catch (error) {
      console.error("Error deleting faculty member:", error);
      toast.error("Error deleting faculty member.");
    }
  };

  const handleUpdate = (faculty) => {
    setSelectedFaculty(faculty);
    setName(faculty.name);
    setDesignation(faculty.designation);
    setDept(faculty.dept);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(
        `https://exam-duty-scheduler-backend.onrender.com/updateFaculty/${selectedFaculty._id}`,
        {
          name,
          designation,
          password, // Include password in the update request
          dept,
        }
      );
      toast.success("Faculty member updated successfully!");
      setTimeout(() => {
        clearForm();
        fetchFacultyData();
      }, 2000);
    } catch (error) {
      console.error("Error updating faculty member:", error);
      toast.error("Error updating faculty member.");
    }
  };

  const clearForm = () => {
    setName("");
    setDesignation("");
    setPassword("");
    setDept("CSE");
    setMessage("");
    setSelectedFaculty(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <section className="min-h-screen flex flex-col gap-4 items-center justify-center p-5 bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {selectedFaculty ? "Update Faculty Member" : "Add Faculty Member"}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Designation:
            </label>
            <input
              type="text"
              name="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          {!selectedFaculty && (
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password:
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 pr-10"
              />
              <span
                className="absolute top-8 right-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
              </span>
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Department:
            </label>
            <select
              name="department"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="CS">CS</option>
              <option value="IS">IS</option>
              <option value="AIML">AIML</option>
              <option value="CSD">CSD</option>
              <option value="CSBS">CSBS</option>
              <option value="ECE">ECE</option>
              <option value="MECH">MECH</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {selectedFaculty ? "Update Faculty" : "Add Faculty"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-green-500">{message}</p>
        )}
      </div>
      <div className="bg-white p-8 items-center text-center rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">All Faculty</h1>
        <table className="table-auto w-full my-4">
          <tbody>
            <tr>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Designation</th>
              <th className="px-4 py-2 border border-gray-300">Dept</th>
              <th className="px-4 py-2 border border-gray-300">Password</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
            {facultyData.map((faculty) => (
              <tr key={faculty._id}>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.designation}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.dept}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.password}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    onClick={() => handleDelete(faculty._id)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={() => handleUpdate(faculty)}
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

export default AddFaculty;
