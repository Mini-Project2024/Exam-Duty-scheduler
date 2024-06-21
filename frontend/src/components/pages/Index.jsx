import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../css/Index.css";
import logo from "../../images/logo.png";
import LoginIcon from '@mui/icons-material/Login';

function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post("http://localhost:3106/login", {
        username,
        password,
      });

      // Check if the login was successful
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);

        toast.success("User logged in successfully");

        setTimeout(() => {
          if (username === "myadmin" && password === "admin123") {
            navigate("/main");
          } else {
            navigate("/users");
          }
        }, 1000);
      } else {
        // Handle failed login (user not found or invalid credentials)
        toast.error("User not found or invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error during login");
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-[#3572EF] text-white">
      {/* Left side */}
      <div
        className={` flex flex-col justify-center items-center w-1/2 p-8 bg-white text-black shadow-lg ${
          fade ? "fade-in" : ""
        }`}
      >
        <img src={logo} className="w-28 absolute top-3 left-3" alt="logo" />
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            CANARA DUTY SCHEDULER
          </h1>
          <h6 className="text-lg md:text-xl text-left max-w-md">
            Welcome to the Canara Duty Scheduler.
            <br />
            <br />
            <p className="text-lg">A platform that is designed to streamline the process of scheduling
            and managing examination duties.
            This website enables administrators to efficiently assign exam
            duties to faculty members. Its intuitive interface and robust
            functionality ensure a seamless experience for all users.
            </p>
            <br />
            Please <span className="text-[#3572EF] font-bold text-xl border-[#3572EF]">login<LoginIcon/></span>
          </h6>
        </div>
      </div>

      {/* Wavy border */}
      {/* <div className="wavy-border"></div> */}

      {/* Right side */}
      <div
        className={`flex flex-col justify-center items-center w-1/2 p-8 max-w-sm mx-auto`}
      >
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
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3572EF] mb-4 text-black"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
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
