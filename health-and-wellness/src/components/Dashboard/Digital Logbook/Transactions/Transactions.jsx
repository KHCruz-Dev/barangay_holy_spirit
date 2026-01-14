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
import TransactionsTable from "./TransactionsTable";
import CreateTransactionModal from "./CreateTransactionModal";
import PatientModal from "./PatientModal";
/*

import ServiceCard from "./ServiceCard";
import ServiceModal from "./ServiceModal";*/
import InputFloatingLabel from "../../../Common/InputFloatingLabel";

const Transactions = () => {
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  const summaryData = [
    {
      title: "Total Transactions (This Month)",
      value: "157",
      icon: FaStethoscope,
    },
    {
      title: "Voter / Non-Voter Ratio",
      value: "60% / 40%",
      icon: FaHeartbeat,
    },
    {
      title: "New Patients This Week",
      value: "53",
      icon: FaCalendarAlt,
    },
    { title: "Most Availed Service", value: "Detox", icon: FaLeaf },
  ];

  const handleAdd = () => {
    setIsTransactionModalOpen(true);
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  return (
    <div>
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">Transactions</h1>
      <p className="text-sm text-gray-800 mt-2">
        Track and organize all resident health transactions and service records
        with ease.
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
          <InputFloatingLabel id="search-service" label="Search Transactions" />
        </div>

        <button
          onClick={handleAdd}
          className="mt-4 text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-800 bg-white hover:bg-green-800 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center gap-1"
        >
          <MdAdd size={18} /> Add New Transaction
        </button>
      </div>

      <hr className="my-1 border-gray-400" />

      {/* Cards Display */}
      <h1 className="text-lg text-gray-800 mt-4 mb-2">Manage Transactions</h1>

      <div className="mt-6">
        <TransactionsTable />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* mockServices.map((service) => (
          <ServiceCard key={service.id} service={service} onEdit={handleEdit} />
        )) */}
      </div>
      <CreateTransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
      />

      {/* Modal for Add/Edit */}
      {/*<ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={editingService}
      /> */}
    </div>
  );
};

export default Transactions;
