
import { Routes, Route } from "react-router-dom";
import AssignDuty from "./pages/AssignDuty";
import FacultyDetails from "./pages/FacultyDetails";
import AddFaculty from "./pages/AddFaculty";
import AddExamDetails from "./pages/AddExamDetails";
import UserDetails from "./pages/UserDetails";
import ExchangeDuty from "./pages/ExchangeDuty";

const MainContent = () => {
  return (
    <div className="flex-1">
      <Routes>
        <Route path="/assignduty" element={<AssignDuty/>} />
        <Route path="/facultydetails" element={<FacultyDetails />} />
        <Route path="/addFaculty" element={<AddFaculty/>} />
        <Route path="/examDates" element={<AddExamDetails />} />
        <Route path="/DutyDetails" element={<UserDetails />} />
        <Route path="/exchangeDuty" element={<ExchangeDuty />} />
      </Routes>
    </div>
  );
};

export default MainContent;
