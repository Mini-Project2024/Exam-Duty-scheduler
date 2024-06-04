import React, { useState } from 'react';
import '../css/Index.css'; // Assuming your CSS file path
import { useNavigate } from 'react-router-dom';

function Index() { // Receive setIsAuthenticated as a prop
  console.log('Index component rendered');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // const history=useHistory();
  const HandleSubmit=(e)=>{
    e.preventDefault();
    // history.push('/main');
    navigate('/main');
    console.log("Hello");
  }
  return (
    <div className="login-container flex flex-col justify-center items-center min-h-screen bg-[#2f4850] text-white p-8 max-w-sm mx-auto">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={HandleSubmit}>
        <label htmlFor="username" className="text-white font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 mb-4"
        />
        <label htmlFor="password" className="text-white font-bold mb-2">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-3 rounded-md font-medium cursor-pointer hover:bg-gray-700 transition: background-color 0.3s ease-in-out" // Updated styles
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Index;
