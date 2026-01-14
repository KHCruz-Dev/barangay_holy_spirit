import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from "react-icons/fa";
import React from "react";

const icons = {
  success: <FaCheckCircle className="h-5 w-5 text-green-600" />,
  error: <FaTimesCircle className="h-5 w-5 text-red-600" />,
  info: <FaInfoCircle className="h-5 w-5 text-blue-600" />,
};

const ToastAlert = ({ message, type = "success" }) => {
  const baseStyle =
    " rounded-lg px-4 py-3 text-sm shadow-md flex items-center gap-3 border transition-all duration-300 w-fit";
  const typeStyles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default ToastAlert;
