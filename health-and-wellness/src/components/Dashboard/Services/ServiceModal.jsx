import React, { useState, useEffect } from "react";
import InputFloatingLabel from "../../Common/InputFloatingLabel";
import ToggleSwitch from "../../Common/ToggleSwitch";
import ToastAlert from "../../Common/ToastAlert";

import { IoClose } from "react-icons/io5"; // optional

const ServiceModal = ({ isOpen, onClose, service }) => {
  /* Logic Variables */
  const [available, setAvailable] = useState(true);
  const [markForDeletion, setMarkForDeletion] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🆕

  /* Value Variables */
  const [serviceName, setServiceName] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  const handleSave = (e) => {
    e.preventDefault(); // 🆕 stop default form behavior
    setIsSubmitting(true);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      setIsSubmitting(false);
      handleReset(); // 🆕 reset values
      onClose(); // 🆕 close modal
    }, 2000);
  };

  const handleReset = () => {
    setServiceName("");
    setDeleteEmail("");
    setDeletePassword("");
    setAvailable(true);
    setMarkForDeletion(false);
  };

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    } else {
      setServiceName(service?.name || "");
      setAvailable(service?.available ?? true);
    }
  }, [isOpen, service]);

  const handleConfirmDelete = (e) => {
    e.preventDefault();
    alert("Service marked for deletion");
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 scale-100 pointer-events-auto"
          : "opacity-0 scale-100 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-4 scale-95"
        }`}
      >
        <button
          className="absolute top-3 right-3 p-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 transition-all duration-200"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
        >
          <IoClose className="w-5 h-5 transform transition-transform duration-200 hover:scale-110" />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {service ? "Update Service" : "Add Service"}
        </h2>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-300">
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <InputFloatingLabel
              id="service-name"
              label="Service name"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              disabled={isSubmitting}
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Available</span>
              <ToggleSwitch
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                color="green"
                disabled={isSubmitting} // 🆕
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-sm py-3 rounded-md border-2 transition duration-200 ${
                isSubmitting
                  ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                  : "text-green-800 border-green-800 bg-transparent hover:bg-green-800 hover:text-white hover:shadow-md hover:shadow-green-400"
              }`}
            >
              {isSubmitting
                ? "Processing..."
                : service
                ? "Update Service"
                : "Add New Service"}
            </button>
          </form>

          {showToast && (
            <div className="mt-4">
              <ToastAlert
                message="Service successfully saved!"
                type="success"
              />
            </div>
          )}
        </div>

        {service && (
          <>
            <hr className="my-5" />
            <div className="flex items-center justify-between pr-4 mb-2">
              <span className="text-sm text-gray-700">Mark for Deletion</span>
              <ToggleSwitch
                checked={markForDeletion}
                onChange={() => setMarkForDeletion(!markForDeletion)}
                color="red"
                disabled={isSubmitting} // 🆕
              />
            </div>

            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                markForDeletion
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gray-50 rounded-lg pt-2 pb-4 px-4 border border-gray-300 flex flex-col gap-1">
                <InputFloatingLabel
                  id="delete-email"
                  type="email"
                  label="Email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  disabled={!markForDeletion || isSubmitting}
                />

                <InputFloatingLabel
                  id="delete-password"
                  type="password"
                  label="Password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  disabled={!markForDeletion || isSubmitting}
                />

                <button
                  className="w-full mt-4 text-red-500 text-sm py-3 rounded-md bg-transparent border-2 border-red-500 transition duration-200 hover:bg-red-500 hover:text-gray-100 hover:shadow-md hover:shadow-red-300"
                  onClick={handleConfirmDelete}
                  disabled={!markForDeletion || isSubmitting} // 🆕
                >
                  Confirm Deletion
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceModal;
