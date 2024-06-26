import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../components/css/sidebar.css";

const Sidebar = ({ themeClass, transitionClass }) => {
  const location = useLocation();

  return (
    <section
      className={`h-full bg-[#2f4850] w-72 left-0 ${transitionClass} ${themeClass}`}
    >
      <ul className="SidebarList">
        {SidebarData.map((val, key) => (
          <li
            key={key}
            className={`row ${location.pathname === val.link ? "active" : ""}`}
          >
            <Link to={val.link} className="flex items-center w-full h-full text-white">
              <div id="icon" className="mr-4">{val.icon}</div>
              <div id="title">{val.title}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Sidebar;
