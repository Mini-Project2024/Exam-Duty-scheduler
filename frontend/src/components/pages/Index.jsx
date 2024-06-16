import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useUser } from './UserContext'; // Import the context
import "../css/Index.css";
import logo from "../../images/logo.png";

function Index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useUser(); // Destructure the login function from the context

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3106/login', { username, password });

      if (response.data.success) {
        login({ username, token: response.data.token }); // Store user information in context

        if (username === "myadmin" && password === "admin123") {
          toast.success("Admin logged in successfully");
          setTimeout(() => {
            navigate('/main');
          }, 1000);
        } else {
          toast.success("User logged in successfully");
          navigate('/users');
        }
      } else {
        toast.error('User not found or invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-[#3572EF] text-white">
      <div className="flex flex-col justify-center w-1/2 p-8 bg-white text-black">
        <img src={logo} className='w-28 absolute top-3 left-3' alt="logo" />
        <h1 className="text-5xl font-bold mb-4">CANARA DUTY SCHEDULER</h1>
        <p className="text-xl text-center max-w-md">
          Welcome to the Canara Duty Scheduler. Please login to continue.
        </p>
      </div>

      <div className="wavy-border"></div>

      <div className="flex flex-col justify-center items-center w-1/2 p-8 max-w-sm mx-auto">
        <Toaster />
        <h1 className="text-4xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-white font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3572EF] mb-4 text-black"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-white font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3572EF] mb-4 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#6397ff] border-[3px] text-white py-2 px-3 rounded-full font-medium cursor-pointer hover:bg-[#2856bf] transition-background-color duration-300 ease-in-out"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Index;
