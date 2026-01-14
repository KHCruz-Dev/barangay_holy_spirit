import React, { useState, useEffect } from "react";
import {
  FaQrcode,
  FaUser,
  FaBirthdayCake,
  FaTint,
  FaVenusMars,
  FaHashtag,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import ServiceCard from "../../Services/ServiceCard";
import InputFloatingLabel from "../../../Common/InputFloatingLabel";
import pf1 from "../../../../assets/images/pf-1.jpg";
import pf2 from "../../../../assets/images/pf-2.jpg";
import pm1 from "../../../../assets/images/pm-1.jpg";
import pm2 from "../../../../assets/images/pm-2.jpg";
import pm3 from "../../../../assets/images/pm-3.jpg";

const steps = ["Select Patient", "Select Service", "Appointment Details"];

const CreateTransactionModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const itemsPerPage = 6;

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 100);
  };

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setSelectedPatient(null);
      setSelectedService(null);
      setCurrentPage(1);

      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const dummyPatients = [
    {
      id: 1,
      name: "John Doe",
      image: pm1,
      age: 30,
      bloodType: "O+",
      gender: "Male",
      qr: "QR001",
    },
    {
      id: 2,
      name: "Jane Smith",
      image: pf1,
      age: 28,
      bloodType: "A-",
      gender: "Female",
      qr: "QR002",
    },
    {
      id: 4,
      name: "Mark Dance",
      image: pm2,
      age: 45,
      bloodType: "B+",
      gender: "Male",
      qr: "QR003",
    },
    {
      id: 5,
      name: "Anthony Portal",
      image: pm3,
      age: 52,
      bloodType: "AB-",
      gender: "Male",
      qr: "QR004",
    },
    {
      id: 6,
      name: "Christian Saints",
      image: pm1,
      age: 34,
      bloodType: "O-",
      gender: "Male",
      qr: "QR005",
    },
    {
      id: 7,
      name: "Ariana Morgan",
      image: pf2,
      age: 29,
      bloodType: "A+",
      gender: "Female",
      qr: "QR006",
    },
    {
      id: 8,
      name: "Vincent Crest",
      image: pm1,
      age: 38,
      bloodType: "B-",
      gender: "Male",
      qr: "QR007",
    },
    {
      id: 9,
      name: "Valerie Crelis",
      image: pf1,
      age: 41,
      bloodType: "AB+",
      gender: "Female",
      qr: "QR008",
    },
    {
      id: 10,
      name: "Solomon Border",
      image: pm2,
      age: 36,
      bloodType: "O+",
      gender: "Male",
      qr: "QR009",
    },
    {
      id: 11,
      name: "Joshua Vertis",
      image: pm3,
      age: 33,
      bloodType: "A-",
      gender: "Male",
      qr: "QR010",
    },
    {
      id: 12,
      name: "Alvin Freid",
      image: pm1,
      age: 27,
      bloodType: "B+",
      gender: "Male",
      qr: "QR011",
    },
    {
      id: 13,
      name: "Grace Marker",
      image: pf1,
      age: 26,
      bloodType: "O-",
      gender: "Female",
      qr: "QR012",
    },
    {
      id: 14,
      name: "Jace Parker",
      image: pm3,
      age: 32,
      bloodType: "A+",
      gender: "Male",
      qr: "QR013",
    },
    {
      id: 15,
      name: "Hannah Smeagles",
      image: pf2,
      age: 40,
      bloodType: "AB+",
      gender: "Female",
      qr: "QR014",
    },
    {
      id: 16,
      name: "Jessica Marks",
      image: pf1,
      age: 24,
      bloodType: "B-",
      gender: "Female",
      qr: "QR015",
    },
  ];

  const mockServices = [
    { id: 1, name: "2D Echo", available: true, stats: {} },
    { id: 2, name: "Ultrasound", available: true, stats: {} },
    { id: 3, name: "Consultation", available: false, stats: {} },
    { id: 4, name: "Detox", available: true, stats: {} },
    { id: 5, name: "Eye Refraction", available: false, stats: {} },
    { id: 6, name: "Laboratory", available: true, stats: {} },
    { id: 7, name: "X-Ray", available: true, stats: {} },
    { id: 8, name: "ECG", available: true, stats: {} },
    { id: 9, name: "High-Potential Theraphy", available: false, stats: {} },
  ];

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentPatients = dummyPatients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(dummyPatients.length / itemsPerPage);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-lg font-semibold">Select Patient</h2>

            <div className="bg-gray-50 border-gray-200 rounded-xl p-4 mb-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="flex-grow mt-2">
                  <InputFloatingLabel label="Search Name" type="text" />
                </div>
                <button className="w-40 text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-800 bg-white hover:bg-green-800 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center gap-1">
                  <FaQrcode size={18} /> Scan QR
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {currentPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`group border rounded-xl p-4 cursor-pointer transition duration-300 hover:bg-green-900 hover:text-white shadow-sm flex flex-col items-center text-center text-sm gap-1 ${
                    selectedPatient?.id === patient.id
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {/* Avatar with border */}
                  <div className="rounded-full border-2 border-green-600  transition-colors duration-300 group-hover:border-white">
                    <img
                      src={patient.image}
                      alt={patient.name}
                      className="rounded-full w-16 h-16 object-cover"
                    />
                  </div>

                  {/* Divider */}
                  <hr className="my-2 border-green-800 group-hover:border-white transition-colors duration-300 w-full" />

                  {/* Name */}
                  <p className="text-base font-semibold">{patient.name}</p>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                    <div className="flex items-center gap-1">
                      <FaBirthdayCake /> <span>{patient.age} yrs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaTint /> <span>{patient.bloodType}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaVenusMars /> <span>{patient.gender}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaHashtag /> <span>{patient.qr}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 text-sm rounded-full ${
                    currentPage === i + 1
                      ? "bg-green-700 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Select a Service</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mockServices.map((service) => {
                return (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onClick={() => setSelectedService(service)}
                    className={`group border rounded-xl p-4 cursor-pointer transition duration-300 hover:bg-green-900 hover:text-white shadow-sm flex flex-col items-center text-center text-sm gap-2 ${
                      selectedService?.id === service.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200"
                    }`}
                  />
                );
              })}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h2 className="text-lg font-semibold mb-4">Appointment Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 border-gray-200 p-4 rounded-xl">
              {[
                "Appointment Date",
                "Queue Number",
                "Appointment Time",
                "Service Start Time",
                "Service Completion Time",
              ].map((label, i) => (
                <div key={i}>
                  <label className="text-sm text-gray-700">{label}</label>
                  <input
                    type={
                      label.includes("Date")
                        ? "date"
                        : label.includes("Number")
                        ? "text"
                        : "time"
                    }
                    placeholder={label.includes("Number") ? "e.g. Q123" : ""}
                    className="w-full border-b-2 border-gray-300 focus:border-green-600 outline-none py-1 text-sm"
                  />
                </div>
              ))}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-100"
      }`}
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg max-w-6xl w-full h-[80vh] transform flex overflow-hidden transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute top-3 right-3 p-2 rounded-full text-red-500 z-20 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 transition-all duration-200"
          onClick={handleClose}
        >
          <IoClose className="w-5 h-5 transform transition-transform duration-200 hover:scale-110" />
        </button>

        <div className="w-56 bg-green-900 text-white relative px-6 py-10 flex flex-col items-center justify-center">
          <ol className="space-y-16 relative z-10">
            {steps.map((label, idx) => {
              const isCompleted = step > idx + 1;
              const isActive = step === idx + 1;

              return (
                <li
                  key={idx}
                  className="flex flex-col items-center text-center"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mb-2 z-10 transition-all duration-300 ${
                      isActive
                        ? "bg-white text-green-900"
                        : isCompleted
                        ? "bg-white text-green-900"
                        : "bg-green-700 text-white"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-sm font-medium transition-colors duration-300 ${
                      isActive ? "text-white" : "text-green-200"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex-1 flex flex-col relative overflow-hidden ">
          <div className="p-8 overflow-y-auto flex-1 relative">
            <div key={step} className="animate-step-in">
              {renderStepContent()}
            </div>
          </div>

          <div className="px-8 py-4 border-t bg-white flex justify-between sticky bottom-0 shadow-xl">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="text-sm font-semibold text-red-700 py-2 px-6 rounded-lg border border-red-700 bg-white hover:bg-red-700 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Back
              </button>
            )}

            {step < steps.length ? (
              <button
                onClick={handleNext}
                className="ml-auto text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-800 bg-white hover:bg-green-800 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => alert("Submitted!")}
                className="ml-auto text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-800 bg-white hover:bg-green-800 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Confirm Appointment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransactionModal;
