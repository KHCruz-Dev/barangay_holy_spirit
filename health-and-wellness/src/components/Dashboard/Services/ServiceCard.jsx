import React from "react";
import {
  FaUserClock,
  FaCalendarWeek,
  FaCalendarAlt,
  FaHistory,
  FaHeartbeat,
  FaStethoscope,
  FaEye,
  FaFlask,
  FaXRay,
  FaNotesMedical,
  FaSpa,
  FaBolt,
  FaRegHospital,
  FaLeaf,
} from "react-icons/fa";
import clsx from "clsx"; // or just string templates

const iconMap = {
  "2D Echo": <FaHeartbeat />,
  Ultrasound: <FaRegHospital />,
  Consultation: <FaStethoscope />,
  Detox: <FaSpa />,
  "Eye Refraction": <FaEye />,
  Laboratory: <FaFlask />,
  "X-Ray": <FaXRay />,
  ECG: <FaNotesMedical />,
  "High-Potential Theraphy": <FaBolt />,
};

const ServiceCard = ({ service, onEdit, onClick, className }) => {
  const { name, available, stats } = service;

  return (
    <div
      className={clsx(
        "bg-white rounded-md p-6 shadow-sm hover:shadow-md hover:bg-green-900 hover:text-white transform transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-[1.02] flex flex-col gap-3 cursor-pointer group",
        className // ✅ merge parent-provided styles
      )}
      onClick={() => {
        if (onClick) onClick(service); // ✅ selection handler
        if (onEdit) onEdit(service); // ✅ optional edit handler
      }}
    >
      <div className="flex items-center gap-3">
        <div className="text-green-800 text-2xl group-hover:text-white transition-colors duration-300">
          {iconMap[name] || <FaLeaf />}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
            {name}
          </h3>
          <span
            className={`text-xs font-medium px-2 rounded-full transition-colors duration-300 ${
              available
                ? "group-hover:bg-white group-hover:text-green-800 bg-green-100 text-green-800"
                : "group-hover:bg-white group-hover:text-red-700 bg-red-100 text-red-700"
            }`}
          >
            Availability: {available ? "Yes" : "No"}
          </span>
        </div>
      </div>

      <hr className="my-1 border-green-800 group-hover:border-white transition-colors duration-300" />

      <div className="grid grid-cols-2 gap-2 text-xs mt-1">
        <Stat icon={<FaUserClock />} label="Today" value={stats.today} />
        <Stat icon={<FaCalendarWeek />} label="This Week" value={stats.week} />
        <Stat icon={<FaCalendarAlt />} label="This Month" value={stats.month} />
        <Stat icon={<FaHistory />} label="Total" value={stats.allTime} />
      </div>
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div className="flex items-center gap-1">
    <div className="text-lg group-hover:text-white text-green-800 transition-colors duration-300">
      {icon}
    </div>
    <p className="text-gray-800 group-hover:text-white text-sm transition-colors duration-300">
      {label}: {value}
    </p>
  </div>
);

export default ServiceCard;
