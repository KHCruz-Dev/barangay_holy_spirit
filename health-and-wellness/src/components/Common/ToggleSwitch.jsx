// src/Common/ToggleSwitch.jsx
import React from "react";

const ToggleSwitch = ({ checked, onChange, color = "green", size = "md" }) => {
  const baseColor =
    {
      green: "peer-checked:bg-green-500",
      red: "peer-checked:bg-red-500",
      gray: "peer-checked:bg-gray-500",
    }[color] || "peer-checked:bg-green-500";

  const scale =
    {
      sm: "w-8 h-4 peer-checked:translate-x-4 left-0.5 top-0.5 w-3 h-3",
      md: "w-10 h-5 peer-checked:translate-x-5 left-0.5 top-0.5 w-4 h-4",
      lg: "w-12 h-6 peer-checked:translate-x-6 left-0.5 top-0.5 w-5 h-5",
    }[size] || "w-10 h-5 peer-checked:translate-x-5 left-0.5 top-0.5 w-4 h-4";

  return (
    <label
      className={`relative inline-flex items-center cursor-pointer ${
        scale.split(" ")[0]
      } ${scale.split(" ")[1]}`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`rounded-full bg-gray-300 transition-colors duration-300 ${baseColor} ${
          scale.split(" ")[0]
        } ${scale.split(" ")[1]}`}
      ></div>
      <div
        className={`absolute ${scale
          .split(" ")
          .slice(2)
          .join(
            " "
          )} transform bg-white rounded-full shadow-md transition-transform duration-300 ${
          scale.split(" ")[2]
        }`}
      />
    </label>
  );
};

export default ToggleSwitch;
