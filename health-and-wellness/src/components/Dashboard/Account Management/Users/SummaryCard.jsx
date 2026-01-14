import React from "react";

const SummaryCard = ({ title, value, subtitle, icon: Icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center gap-4">
      {/* Icon */}
      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
        {Icon && <Icon className="text-green-700 text-xl" />}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </span>

        <span className="text-2xl font-semibold text-gray-800">{value}</span>

        {subtitle && (
          <span className="text-xs text-gray-400 mt-1">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
