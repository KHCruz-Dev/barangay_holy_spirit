import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaCamera,
  FaUserEdit,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaHeartbeat,
  FaPuzzlePiece,
  FaTrashAlt,
} from "react-icons/fa";

import ToggleSwitch from "../../../Common/ToggleSwitch";
import InputFloatingLabel from "../../../Common/InputFloatingLabel";
import DateFloatingLabel from "../../../Common/DateFloatingLabel";
import FileInputFloatingLabel from "../../../Common/FileInputFloatingLabel";
import SelectFloatingLabel from "../../../Common/SelectFloatingLabel";
import TextAreaFloatingLabel from "../../../Common/TextareaFloatingLabel";
import TimeFloatingLabel from "../../../Common/TimeFloatingLabel";

import { useTimePicker } from "../../../../utils/useTimePicker";
import { formatLongDate } from "../../../../utils/dateFormatters";

// ...imports stay the same
const PatientModal = ({ patient, onClose }) => {
  const [markForDeletion, setMarkForDeletion] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [voter, setVoter] = useState(false);
  const [pwd, setPwd] = useState(false);
  const [fps4, setFps4] = useState(false);
  const [employed, setEmployed] = useState(false);
  const [student, setStudent] = useState(false);

  const [localPatient, setLocalPatient] = useState({ ...patient });

  useEffect(() => {
    if (patient) {
      setLocalPatient({ ...patient });
      setVoter(patient?.voter === "Yes" || patient?.voter === true);
      setPwd(patient?.pwd === "Yes" || patient?.pwd === true);
      setFps4(patient?.fps4 === "Yes" || patient?.fps4 === true);
      setEmployed(!!patient?.employed);
      setStudent(!!patient?.student);
    }
  }, [patient]);

  useEffect(() => {
    if (patient) setIsVisible(true);
  }, [patient]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 200);
  };

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    alert(`Patient ${patient.fullName} marked for deletion.`);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "contact" && !/^\d{0,10}$/.test(value)) return;
    setLocalPatient((prev) => ({ ...prev, [id]: value }));
  };

  if (!patient) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-100"
      }`}
    >
      <div
        className={`relative bg-white rounded-lg shadow-lg p-6 max-w-6xl w-full transform transition-all duration-200 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          className="absolute top-3 right-3 p-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 transition-all duration-200"
          onClick={handleClose}
          aria-label="Close"
        >
          <IoClose className="w-5 h-5 transform transition-transform duration-200 hover:scale-110" />
        </button>

        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          {/* Left column */}
          <div className="relative flex flex-col items-center justify-center gap-2 w-full h-full lg:w-1/6 py-8">
            {/* Top blue divider */}
            <div className="absolute top-0 left-0 w-full border-t-2 border-green-900" />

            {/* Bottom blue divider */}
            <div className="absolute bottom-0 left-0 w-full border-t-2 border-green-900" />
            <img
              src={patient.pictureUrl}
              alt="Patient"
              className="w-32 h-32 rounded-full object-cover border-4 border-green-900 shadow"
            />
            <button className="w-full text-sm font-semibold text-green-900 py-2 rounded-lg border border-green-900 bg-white hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2">
              <FaCamera className="transition-transform duration-300 group-hover:scale-110" />
              Take New Picture
            </button>
            <hr className="w-full my-2 border-t border-gray-400" />
            <div className="bg-green-900 border border-green-900 rounded-xl w-full flex flex-col items-center justify-center p-3">
              <img
                src={patient.qrCodeUrl}
                alt="QR Code"
                className="w-32 h-32 object-contain border rounded"
              />
              <span className="text-sm text-white text-center mt-3">
                Patient ID: <strong>{patient.id}</strong>
              </span>
            </div>
          </div>

          {/* Right column – form */}
          <div className="flex-1 max-h-[60vh] overflow-y-auto mt-6 space-y-6 pr-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Patient info updated.");
              }}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4 w-full"
            >
              {/* 🧍 Personal Information */}
              <div className="bg-white shadow-sm p-6 border rounded-lg">
                <h3 className="text-gray-600 font-semibold text-sm mb-2 uppercase flex items-center gap-2">
                  <FaUser className="text-green-800" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputFloatingLabel
                    id="fullName"
                    label="Full Name"
                    value={localPatient.fullName}
                    onChange={handleChange}
                  />
                  <div id="datepicker-root">
                    <DateFloatingLabel
                      id="birthdate"
                      label="Birthdate"
                      value={localPatient.birthdate}
                      onChange={(date) =>
                        setLocalPatient((prev) => ({
                          ...prev,
                          birthdate: date,
                        }))
                      }
                    />
                  </div>
                  <InputFloatingLabel
                    id="age"
                    label="Age"
                    value={localPatient.age}
                    onChange={handleChange}
                  />
                  <SelectFloatingLabel
                    id="bloodType"
                    label="Blood Type"
                    value={localPatient.bloodType}
                    onChange={handleChange}
                    options={bloodTypeData}
                  />
                  <SelectFloatingLabel
                    id="gender"
                    label="Gender"
                    value={localPatient.gender}
                    onChange={handleChange}
                    options={genderData}
                  />
                  <SelectFloatingLabel
                    id="civilStatus"
                    label="Civil Status"
                    value={localPatient.civilStatus}
                    onChange={handleChange}
                    options={civilStatusData}
                  />
                  <SelectFloatingLabel
                    id="nationality"
                    label="Nationality"
                    value={localPatient.nationality}
                    onChange={handleChange}
                    options={mockNationalities}
                  />
                  <InputFloatingLabel
                    id="philhealthNum"
                    label="Philhealth Number"
                    value={localPatient.philhealthNum}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* 🌐 Contact & Demographics */}
              <div className="bg-white shadow-sm p-6 border rounded-lg">
                <h3 className="text-gray-600 font-semibold text-sm mb-2 uppercase flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-800" />
                  Contact & Demographics
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InputFloatingLabel
                    id="contact"
                    label="Contact"
                    value={localPatient.contact}
                    onChange={handleChange}
                  />
                  <InputFloatingLabel
                    id="email"
                    label="Email"
                    value={localPatient.email}
                    onChange={handleChange}
                  />
                  <InputFloatingLabel
                    id="address"
                    label="Address"
                    value={localPatient.address}
                    onChange={handleChange}
                  />
                  <InputFloatingLabel
                    id="precinct"
                    label="Precinct #"
                    value={localPatient.precinct}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* 📅 Appointment Details */}
              <div className="bg-white shadow-sm p-6 border rounded-lg">
                <h3 className="text-gray-600 font-semibold text-sm mb-2 uppercase flex items-center gap-2">
                  <FaCalendarAlt className="text-green-800" />
                  Appointment Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div id="datepicker-root">
                    <DateFloatingLabel
                      id="appointmentDate"
                      label="Appointment Date"
                      value={localPatient.appointmentDate}
                      onChange={(date) =>
                        setLocalPatient((prev) => ({
                          ...prev,
                          appointmentDate: date,
                        }))
                      }
                    />
                  </div>
                  <SelectFloatingLabel
                    id="availedService"
                    label="Availed Service"
                    value={localPatient.availedService}
                    onChange={handleChange}
                    options={mockServices}
                  />
                  <InputFloatingLabel
                    id="queueNumber"
                    label="Queue Number"
                    value={localPatient.queueNumber}
                    onChange={handleChange}
                  />

                  <TimeFloatingLabel
                    id="appointmentTime"
                    label="Appointment Time"
                    value={localPatient.appointmentTime}
                    onChange={() => {}}
                  />

                  <TimeFloatingLabel
                    id="serviceStart"
                    label="Service Start Time"
                    value={localPatient.serviceStart}
                    onChange={() => {}}
                  />
                  <TimeFloatingLabel
                    id="serviceEnd"
                    label="Service Completion Time"
                    value={localPatient.serviceEnd}
                    onChange={() => {}}
                  />
                </div>
              </div>

              {/* 🧩 Other Information */}
              <div>
                <h3 className="text-gray-600 font-semibold text-sm mb-2 uppercase flex items-center gap-2 pl-6">
                  <FaPuzzlePiece className="text-green-800" />
                  Other Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <span className="text-sm text-gray-700">Voter</span>
                    <ToggleSwitch
                      checked={voter}
                      onChange={() => setVoter(!voter)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <span className="text-sm text-gray-700">PWD</span>
                    <ToggleSwitch checked={pwd} onChange={() => setPwd(!pwd)} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <span className="text-sm text-gray-700">4Ps</span>
                    <ToggleSwitch
                      checked={fps4}
                      onChange={() => setFps4(!fps4)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <span className="text-sm text-gray-700">Employed</span>
                    <ToggleSwitch
                      checked={employed}
                      onChange={() => setEmployed(!employed)}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                    <span className="text-sm text-gray-700">Student</span>
                    <ToggleSwitch
                      checked={student}
                      onChange={() => setStudent(!student)}
                    />
                  </div>
                </div>
              </div>

              {/* ✅ Submit */}
              <div className="col-span-full mt-6 flex justify-end">
                <button
                  type="submit"
                  className="mt-4 text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-900 bg-white hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2"
                >
                  <FaUserEdit className="transition-transform duration-300 group-hover:scale-110" />
                  Update Patient Info
                </button>
              </div>
            </form>

            {/* 🗑️ Deletion Form */}
            <form
              onSubmit={handleConfirmDelete}
              className="w-full flex flex-col items-center"
            >
              <div className="flex items-center justify-between w-full max-w-md mb-2">
                <span className="text-sm text-gray-700 font-medium flex items-center gap-2">
                  <FaTrashAlt className="text-red-500" />
                  Mark for Deletion
                </span>

                <ToggleSwitch
                  checked={markForDeletion}
                  onChange={() => setMarkForDeletion(!markForDeletion)}
                  color="red"
                />
              </div>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden w-full max-w-md ${
                  markForDeletion
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 shadow-sm flex flex-col gap-2">
                  <InputFloatingLabel
                    id="delete-email"
                    type="email"
                    label="Email"
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    disabled={!markForDeletion}
                  />
                  <InputFloatingLabel
                    id="delete-password"
                    type="password"
                    label="Password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    disabled={!markForDeletion}
                  />
                  <button
                    type="submit"
                    className="w-full mt-2 text-red-500 text-sm py-2 rounded-md bg-transparent border-2 border-red-500 transition duration-200 hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-300"
                    disabled={!markForDeletion}
                  >
                    Confirm Deletion
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <hr className="my-4 border-gray-400" />
      </div>
    </div>
  );
};

export default PatientModal;
