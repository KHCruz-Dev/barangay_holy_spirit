import React, { useState, useEffect } from "react";
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
import { MdAdd } from "react-icons/md";
import SummaryCard from "./SummaryCard";
import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";
import InputFloatingLabel from "../../Common/InputFloatingLabel";

const Services = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const mockServices = [
    {
      id: 1,
      name: "2D Echo",
      available: true,
      stats: { today: 4, week: 18, month: 67, allTime: 270 },
    },
    {
      id: 2,
      name: "Ultrasound",
      available: true,
      stats: { today: 6, week: 22, month: 78, allTime: 310 },
    },
    {
      id: 3,
      name: "Consultation",
      available: false,
      stats: { today: 2, week: 10, month: 35, allTime: 150 },
    },
    {
      id: 4,
      name: "Detox",
      available: true,
      stats: { today: 1, week: 5, month: 14, allTime: 90 },
    },
    {
      id: 5,
      name: "Eye Refraction",
      available: false,
      stats: { today: 0, week: 3, month: 9, allTime: 45 },
    },
    {
      id: 6,
      name: "Laboratory",
      available: true,
      stats: { today: 10, week: 40, month: 150, allTime: 920 },
    },
    {
      id: 7,
      name: "X-Ray",
      available: true,
      stats: { today: 3, week: 12, month: 60, allTime: 410 },
    },
    {
      id: 8,
      name: "ECG",
      available: true,
      stats: { today: 2, week: 9, month: 33, allTime: 280 },
    },
    {
      id: 9,
      name: "High-Potential Theraphy",
      available: false,
      stats: { today: 0, week: 1, month: 5, allTime: 20 },
    },
  ];

  const summaryData = [
    { title: "Total Services", value: "203", icon: FaStethoscope },
    { title: "Most Availed", value: "Consultation", icon: FaHeartbeat },
    {
      title: "Most Availed (This Month)",
      value: "2D Echo",
      icon: FaCalendarAlt,
    },
    { title: "Least Availed", value: "Detox", icon: FaLeaf },
  ];

  const handleAdd = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">Services</h1>
      <p className="text-sm text-gray-800 mt-2">
        Manage and monitor health & wellness services offered to residents.
      </p>
      <hr className="my-4 border-gray-400" />

      {/* Summary Cards */}
      <h1 className="text-lg text-gray-800">Quick Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2 pb-6">
        {summaryData.map((item, index) => (
          <SummaryCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </div>

      <hr className="my-1 border-gray-400" />

      {/* Filter + Add Button */}
      <h1 className="text-lg text-gray-800 mt-4 mb-2">
        Search and Filter Services
      </h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="w-full sm:w-96 bg-white border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-all duration-300">
          <InputFloatingLabel id="search-service" label="Search Service" />
        </div>

        <button
          onClick={handleAdd}
          className={`mt-3 sm:mt-0 flex items-center gap-2 px-4 py-2 text-sm rounded-md border-2 transition duration-200
    text-green-800 border-green-800 bg-transparent
    hover:bg-green-800 hover:text-white hover:shadow-md hover:shadow-green-400
  `}
        >
          <MdAdd size={18} />
          Add New Service
        </button>
      </div>

      <hr className="my-1 border-gray-400" />

      {/* Cards Display */}
      <h1 className="text-lg text-gray-800 mt-4 mb-2">Manage Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockServices.map((service) => (
          <ServiceCard key={service.id} service={service} onEdit={handleEdit} />
        ))}
      </div>

      {/* Modal for Add/Edit */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={editingService}
      />
    </div>
  );
};

export default Services;
