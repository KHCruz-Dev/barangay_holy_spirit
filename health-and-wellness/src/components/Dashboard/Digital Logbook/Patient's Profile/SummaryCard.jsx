// src/components/SummaryCard.jsx
import React from "react";

const SummaryCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      role="button"
      tabIndex={0}
      className="bg-white text-gray-800 border border-gray-200 rounded-xl p-4 shadow-sm cursor-default flex items-center gap-4 
      transition-all duration-200 ease-out hover:shadow-md hover:bg-green-900 hover:text-white active:scale-[0.98] active:bg-green-800 
      focus-visible:ring-2 focus-visible:ring-green-700"
    >
      {/* Icon */}
      {Icon && (
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-800 transition-colors duration-200 
          group-hover:bg-white group-hover:text-green-900"
        >
          <Icon className="text-2xl" />
        </div>
      )}

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xs font-medium tracking-wide opacity-80">
          {title}
        </span>
        <span className="text-xl font-semibold leading-tight">{value}</span>
      </div>
    </div>
  );
};

export default SummaryCard;
