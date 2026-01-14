// src/components/SummaryCard.jsx
import React from "react";

const SummaryCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition flex items-center gap-4">
      {Icon && (
        <div className="text-green-800 text-3xl">
          <Icon />
        </div>
      )}
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
