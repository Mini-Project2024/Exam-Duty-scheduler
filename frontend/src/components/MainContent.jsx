import React from "react";
import { Routes, Route } from "react-router-dom";
import AssignDuty from "./pages/AssignDuty";
import FacultyDetails from "./pages/FacultyDetails";
import AddFaculty from "./pages/AddFaculty";
import AddExamDetails from "./pages/AddExamDetails";

const MainContent = () => {
  return (
    <div className="flex-1">
      <Routes>
        <Route path="/assignduty" element={<AssignDuty/>} />
        <Route path="/facultydetails" element={<FacultyDetails />} />
        <Route path="/addFaculty" element={<AddFaculty/>} />
        <Route path="/examDates" element={<AddExamDetails />} />
      </Routes>
    </div>
  );
};

export default MainContent;
