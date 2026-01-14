import React from "react";
import { FiChevronDown } from "react-icons/fi";

const SidebarDropdown = ({
  label,
  Icon,
  children,
  isOpen,
  onToggle,
  dropdownId,
}) => {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onToggle(dropdownId)}
        className={`group flex items-center gap-2 w-full text-left text-sm py-2 px-2 rounded-md border-l-4 transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "bg-green-900 text-white border-green-900"
              : "border-transparent text-gray-800 hover:text-green-900 hover:bg-blue-50 hover:border-green-900"
          }
        `}
      >
        <Icon
          className={`w-5 h-5 transition-colors duration-300 ${
            isOpen ? "text-white" : "text-gray-500 group-hover:text-green-900"
          }`}
        />
        <span
          className={`${
            isOpen ? "text-white" : "text-inherit"
          } font-medium flex-1`}
        >
          {label}
        </span>
        <FiChevronDown
          className={`w-4 h-4 transform transition-transform duration-300 ${
            isOpen
              ? "rotate-180 text-white"
              : "text-gray-500 group-hover:text-green-900"
          }`}
        />
      </button>

      <div
        className={`ml-6 transition-all duration-300 ease-in-out space-y-1 ${
          isOpen ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default SidebarDropdown;
