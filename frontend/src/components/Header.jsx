import React from 'react';
import logo from '../images/logo.png';
import Button from './Button';
import { logout } from './utils/auth';

const Header = ({ toggleTheme, themeClass,isDarkTheme, buttonThemeClass, transitionClass }) => {
  const shadowClass = isDarkTheme ? 'shadow-gray-700' : 'shadow-md';
  return (
    <header className={`shadow-md top-0 left-0 right-0 w-full ${shadowClass} ${transitionClass} ${themeClass}`}>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-15 w-24" />
          <span className="text-2xl font-bold text-[#07506f] tracking-wide drop-shadow-lg">Semester End Exam Duty Scheduler</span>
        </div>
        <div className="flex justify-between gap-6 items-center">
          {/* <button className="ml-2 w-5 h-5" onClick={toggleTheme}>
            {isDarkTheme ? <LightModeOutlinedIcon/> : <DarkModeOutlinedIcon/>}
          </button> */}
          <Button text="Logout" onClick={logout} extraClass={buttonThemeClass} />
        </div>
      </div>
    </header>
  );
};

export default Header;
