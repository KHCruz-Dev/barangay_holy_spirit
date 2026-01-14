import React from "react";

const SidebarItem = ({ label, Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`nav-slide ${
      isActive ? "active" : ""
    } relative flex items-center gap-2 w-full text-left text-sm py-2 px-2 rounded-md
      transition-all duration-300 ease-in-out
      ${
        isActive
          ? "bg-green-900 text-white border-green-900"
          : "text-gray-800 border-transparent hover:border-green-900 hover:text-green-900 hover:bg-[#e8f5e9]"
      }
    `}
  >
    <Icon
      className={`w-5 h-5 transition-colors duration-300 ${
        isActive ? "text-white" : "text-gray-500 group-hover:text-green-900"
      }`}
    />
    <span className={`font-medium ${isActive ? "text-white" : ""}`}>
      {label}
    </span>
  </button>
);

export default SidebarItem;
