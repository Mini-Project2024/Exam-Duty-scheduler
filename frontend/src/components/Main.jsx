import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import AssignDuty from "./pages/AssignDuty";
import FacultyDetails from "./pages/FacultyDetails";
import MainContent from "./MainContent";

const Main = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const themeClass = isDarkTheme
    ? "bg-gray-800 text-white"
    : "bg-white text-gray-800";
  const buttonThemeClass = isDarkTheme ? "text-white" : "text-[#3572EF]";
  const transitionClass = "transition-colors duration-500";

  return (
    <div
      className={`app ${themeClass} ${transitionClass} flex flex-col h-screen`}
    >
      <Header
        toggleTheme={toggleTheme}
        isDarkTheme={isDarkTheme}
        themeClass={themeClass}
        transitionClass={transitionClass}
        buttonThemeClass={buttonThemeClass}
      />
      <div className="flex flex-1">
        <SideBar themeClass={themeClass} transitionClass={transitionClass} />
        <div className="flex flex-col flex-1">
          <MainContent />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Main;
