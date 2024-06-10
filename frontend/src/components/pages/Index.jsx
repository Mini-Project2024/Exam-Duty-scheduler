import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Index() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send login request to backend
      const response = await axios.post('http://localhost:3106/login', { username, password });
      
      // Check if the login was successful
      if (response.data.success) {
        if(username=="myadmin" && password=="admin123"){
          toast.success("User Logged in successfully");
          setTimeout(() => {
            navigate('/main');
          }, 1000);
        }
        else
        navigate('/users');
      } else {
        // Handle failed login (user not found or invalid credentials)
        toast.error('User not found or invalid credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Error during login');
    }
  };

  return (
    <div className="login-container flex flex-col justify-center items-center min-h-screen bg-[#2f4850] text-white p-8 max-w-sm mx-auto">
      <Toaster/>
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username" className="text-white font-bold mb-2">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 mb-4 text-black"
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
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-600 mb-4 text-black"
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
