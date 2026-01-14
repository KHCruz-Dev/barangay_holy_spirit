// src/components/Common/FileInputFloatingLabel.jsx
import React from "react";

const FileInputFloatingLabel = ({ id, label, onChange, disabled = false }) => {
  return (
    <div className="relative">
      <input
        type="file"
        id={id}
        onChange={onChange}
        disabled={disabled}
        className="peer hidden"
      />
      <label
        htmlFor={id}
        className={`block w-full cursor-pointer rounded-md border-2 border-dashed px-4 py-3 text-sm text-center transition ${
          disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-gray-600 hover:border-green-400 border-gray-300"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default FileInputFloatingLabel;
