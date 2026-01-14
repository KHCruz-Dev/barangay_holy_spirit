// src/components/Common/TextareaFloatingLabel.jsx
import React from "react";

const TextareaFloatingLabel = ({
  id,
  label,
  value,
  onChange,
  disabled = false,
  rows = 4,
}) => {
  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        placeholder=" "
        className={`peer w-full border-0 border-b-2 bg-transparent px-2 pt-7 pb-1 text-sm text-gray-800 resize-none focus:outline-none ${
          disabled
            ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
            : "border-gray-300 focus:border-green-600"
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-2 top-1 text-sm transition-all duration-200 ${
          disabled ? "text-gray-400" : "text-gray-800 peer-focus:text-green-600"
        } peer-placeholder-shown:top-6 peer-focus:top-1`}
      >
        {label}
      </label>
    </div>
  );
};

export default TextareaFloatingLabel;
