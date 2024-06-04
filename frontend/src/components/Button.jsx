import React from "react";

const Button = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border-[#3572EF] border-[3px] text-[#3572EF] font-bold rounded-md px-4 py-2 w-24 hover:bg-[#3572EF] hover:text-white transition-colors duration-300 flex items-center justify-center space-x-2"
    >
      <span>{text}</span>
      <i className="fa-solid fa-right-from-bracket"></i>
    </button>
  );
};

export default Button;
