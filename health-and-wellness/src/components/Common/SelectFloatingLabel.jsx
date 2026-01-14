import React, { useState } from "react";

const SelectFloatingLabel = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  options = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseDown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 50); // faster close
  };

  return (
    <div
      className={`relative w-full transition-all duration-200 ease-in-out
    ${
      disabled
        ? ""
        : isOpen
        ? "bg-white ring-2 ring-green-600 shadow-sm rounded-md"
        : ""
    }
  `}
    >
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onMouseDown={handleMouseDown}
        onBlur={handleBlur}
        className={`peer w-full px-2 pt-7 pb-1 pr-8 text-sm focus:outline-none appearance-none transition-all
    ${
      disabled
        ? "border border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed rounded-md"
        : isOpen
        ? "border border-green-300 text-gray-900 bg-white rounded-md"
        : "border-0 border-b-2 border-gray-300 focus:border-green-600 bg-transparent text-gray-800"
    }
  `}
      >
        <option value="" disabled hidden></option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className={`absolute left-2 top-1 text-sm transition-all duration-200
    ${
      disabled
        ? "text-gray-400"
        : isOpen
        ? "text-gray-800"
        : "text-gray-800 peer-focus:text-green-600"
    }
    peer-placeholder-shown:top-6 peer-focus:top-1`}
      >
        {label}
      </label>

      <svg
        className={`absolute right-2 top-[2rem] pointer-events-none w-4 h-4
    transition-transform duration-200 ease-in-out
    ${
      disabled
        ? "text-gray-300"
        : isOpen
        ? "text-gray-800 rotate-180"
        : "text-gray-500"
    }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
};

export default SelectFloatingLabel;
