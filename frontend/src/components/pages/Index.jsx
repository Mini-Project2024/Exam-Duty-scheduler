import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../css/Index.css";
import logo from "../../images/logo.png";
import LoginIcon from "@mui/icons-material/Login";
import backgroundImg from "../../images/CEC.jpg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import logo2 from "../../images/Ammembal.png";
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import HttpsIcon from '@mui/icons-material/Https';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Index() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLoginClick = () => {
    setIsLoginVisible(true);
  };

  const handleCloseLogin = () => {
    setIsLoginVisible(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend
      const response = await axios.post("https://exam-duty-scheduler-backend.onrender.com/login", {
        username,
        password,
      });

      // Check if the login was successful
      if (response.data.success) {
        // Store token and username in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username); // Assuming username is returned from backend

        toast.success("User logged in successfully");

        setTimeout(() => {
          if (username === "myadmin" && password === "admin123") {
            navigate("/main/assignduty");
          } else {
            navigate("/users/DutyDetails");
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
    <>
      <Toaster />
      <div
        className="min-h-screen w-full text-white relative bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <img
          src={logo}
          className="w-28 absolute top-3 left-3 z-50"
          alt="logo"
        />

        <img
          src={logo2}
          className="w-24 rounded-full absolute top-3 right-3 z-50"
          alt="logo"
        />

        {/* Adding black tint */}
        <div className="absolute inset-0 bg-black opacity-40 z-30"></div>

        <div>
          <div className="flex flex-col justify-start items-start top-24 p-16 text-white w-full absolute z-40">
            <h1 className="text-4xl md:text-4xl font-bold mb-4">
              SEMESTER END DUTY EXAM SCHEDULER
            </h1>
            <h6 className="text-lg md:text-xl max-w-md">
              Welcome to the Canara Semester End Exam Duty Scheduler.
              <br />
              <br />
              <p className="text-lg">
                A platform that is designed to streamline the process of
                scheduling and managing examination duties. This website enables
                administrators to efficiently assign exam duties to faculty
                members. Its intuitive interface and robust functionality ensure
                a seamless experience for all users.
              </p>
              <br />
              <button
                className="text-white font-bold text-xl px-9 py-2 rounded-3xl
               border-white border-2 hover:bg-white hover:text-[#3572EF] hover:border-[#3572EF]  
               bg-[#3572EF] transform ease-in-out cursor-pointer"
                onClick={handleLoginClick}
              >
                login
                <LoginIcon />
              </button>
            </h6>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-1/4 bg-[#fff] p-8 transition-all ease-in-out ${
          isLoginVisible ? "opacity-1 duration-300" : "opacity-0 duration-300"
        } z-50`}
        style={{ display: isLoginVisible ? "block" : "none" }}
      >
        <CloseRoundedIcon
          className="absolute top-3 right-3 text-black cursor-pointer"
          onClick={handleCloseLogin}
        />
        <h1 className="text-4xl text-center text-black font-bold mb-6 ">Login</h1>
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-black font-bold mb-2">
              Username <PersonIcon/>
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
          <div className="flex flex-col relative">
            <label htmlFor="password" className="text-black font-bold mb-2">
              Password <HttpsIcon/>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3572EF] mb-4 text-black pr-10"
            />
            <span
              className="absolute top-10 right-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
            </span>
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
    </>
  );
}

export default Index;
