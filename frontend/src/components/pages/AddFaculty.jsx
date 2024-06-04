import React, { useState, useEffect } from "react";
import axios from "axios";

const AddFaculty = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("CSE");
  const [message, setMessage] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3106/addFaculty", {
        name,
        email,
        password,
        dept,
      })
      .then((result) => {
        console.log(result);
        setMessage("Faculty member added successfully!");
        setTimeout(() => {
          setName("");
          setEmail("");
          setPassword("");
          setDept("CSE");
          setMessage("");
          fetchFacultyData();
          setSelectedFaculty(null);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Error adding faculty member.");
      });
  };

  
  useEffect(() => {
    fetchFacultyData();
  }, []);

  const fetchFacultyData = async () => {
    try {
      const response = await axios.get("http://localhost:3106/faculty"); // Assuming an endpoint to retrieve faculty data
      setFacultyData(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Error fetching faculty data.");
    }
  };

  return (
    <section className="min-h-screen flex flex-col gap-4 items-center justify-center p-5 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add Faculty Member
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Department:
            </label>
            <select
              name="department"
              onChange={(e) => setDept(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="CSE">CSE</option>
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
            Submit
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
              <th className="px-4 py-2 border border-gray-300">Email</th>
              <th className="px-4 py-2 border border-gray-300">Dept</th>
              <th className="px-4 py-2 border border-gray-300">Action</th>
            </tr>
            {facultyData.map((faculty) => (
              <tr key={faculty._id}>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.email}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {faculty.dept}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                    // onClick={() => handleDelete(faculty._id)} // Pass faculty ID for deletion
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded-md ml-2 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                    // onClick={() => handleUpdate(faculty)} // Pass faculty object for update form
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
