import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaAddressCard,
  FaPuzzlePiece,
  FaUserEdit,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { formatLongDate } from "../../../../utils/dateFormatters";

const PatientsProfileReviewModal = ({
  isOpen,
  onClose,
  onConfirm,
  resident = {},
  avatarPreview,
  isSaving,
  isEditMode, // ✅ ADD
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(t);
    }
    setIsVisible(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const safe = (v, fb = "N/A") =>
    v !== undefined && v !== null && v !== "" ? v : fb;

  const buildCompleteAddress = (resident) => {
    const p = (v) =>
      v !== undefined && v !== null && String(v).trim() !== ""
        ? String(v).trim()
        : null;

    // 🟠 NON-RESIDENT FORMAT
    if (resident.is_non_resident) {
      const line1 = p(resident.streetAddressLine);

      const line2 = [
        p(resident.barangay),
        p(resident.cityMunicipality),
        p(resident.province),
        p(resident.region),
      ]
        .filter(Boolean)
        .join(", ");

      return [line1, line2].filter(Boolean).join(", ") || "N/A";
    }

    // 🟢 RESIDENT FORMAT
    const line1 = [
      p(resident.streetNumber),
      p(resident.streetRoad),
      p(resident.subdivisionVillage),
    ]
      .filter(Boolean)
      .join(" ");

    const line2 = [
      p(resident.barangay),
      p(resident.cityMunicipality),
      p(resident.province),
      p(resident.region),
    ]
      .filter(Boolean)
      .join(", ");

    return [line1, line2].filter(Boolean).join(", ") || "N/A";
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 200);
  };

  return (
    <div
      className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 transition-opacity duration-300
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div
        className={`
          relative bg-white w-full max-w-4xl rounded-xl shadow-xl border border-green-900 flex flex-col transition-transform duration-200
          ${isVisible ? "scale-100" : "scale-95"}
        `}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-green-900">
          <img
            src={avatarPreview}
            alt="Resident"
            className="w-20 h-20 rounded-sm border-4 border-green-900 object-cover"
          />

          <div className="flex-1">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaUser className="text-green-800" />
              {isEditMode ? "Review Updates" : "Review Resident Details"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isEditMode
                ? "Please confirm before updating this record."
                : "Please confirm before saving this record."}
            </p>

            <p className="mt-2 text-base font-semibold text-gray-900">
              {[
                resident.prefix,
                resident.firstName,
                resident.middleName,
                resident.lastName,
                resident.suffix,
              ]
                .filter(Boolean)
                .join(" ") || "No name provided"}
            </p>

            <p className="text-xs text-gray-600">
              Alagang ID:{" "}
              <span className="font-mono font-semibold text-green-800">
                {safe(resident.alagangValmocinaID)}
              </span>
            </p>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-red-600 hover:bg-red-600 hover:text-white transition"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[60vh]">
          {/* QR + ID */}
          <div className="bg-gray-50 border border-green-900 rounded-lg p-4 flex items-center gap-4">
            <div className="bg-white p-2 rounded border border-green-900">
              <QRCode value={safe(resident.alagangValmocinaID, "")} size={88} />
            </div>
            <div>
              <p className="text-xs uppercase text-gray-600 font-semibold">
                Alagang Valmocina ID
              </p>
              <p className="font-mono font-semibold text-green-800 break-all">
                {safe(resident.alagangValmocinaID)}
              </p>
            </div>
          </div>

          {/* Personal + Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Personal Information" icon={FaUser}>
              <Item
                label="Birthdate"
                value={formatLongDate(resident.birthDate)}
              />
              <Item label="Age" value={resident.age} />
              <Item label="Gender" value={resident.gender} />
              <Item label="Blood Type" value={resident.bloodType} />
              <Item label="Civil Status" value={resident.civilStatus} />
              <Item label="Nationality" value={resident.nationality} />
            </Section>

            <Section title="Contact" icon={FaPhoneAlt}>
              <Item label="Contact #" value={resident.contactNumber} />
              <Item label="Email" value={resident.emailAddress} />
              <Item
                label="Emergency Contact Name"
                value={resident.emergencyContactFullName}
              />
              <Item
                label="Emergency Contact #"
                value={resident.emergencyContactNumber}
              />
            </Section>
          </div>

          {/* Address */}
          <Section title="Address" icon={FaMapMarkerAlt}>
            <Item label="Region" value={resident.region} />
            <Item label="Province" value={resident.province} />
            <Item
              label="City / Municipality"
              value={resident.cityMunicipality}
            />
            <Item label="Barangay" value={resident.barangay} />
            <Item
              label="Complete Address"
              value={buildCompleteAddress(resident)}
            />
          </Section>

          {/* IDs + Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Identification Cards" icon={FaAddressCard}>
              {resident.identificationCards?.length ? (
                resident.identificationCards.map((c, i) => (
                  <Item key={i} label={c.idTypeLabel} value={c.idNumber} />
                ))
              ) : (
                <p className="text-sm text-gray-500">No IDs provided</p>
              )}
            </Section>

            <Section title="Other Information" icon={FaPuzzlePiece}>
              <Item label="Voter" value={resident.isVoter ? "Yes" : "No"} />
              <Item label="PWD" value={resident.isPWD ? "Yes" : "No"} />
              <Item
                label="Employed"
                value={resident.isEmployed ? "Yes" : "No"}
              />
              <Item label="Student" value={resident.isStudent ? "Yes" : "No"} />
            </Section>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
          <div className="flex items-center justify-end gap-3">
            {/* RIGHT — Workflow actions */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="px-6 py-2 text-sm font-semibold text-red-700 border border-red-700 rounded-lg
                   hover:bg-red-700 hover:text-white transition"
              >
                Back & Edit
              </button>

              <button
                onClick={onConfirm}
                disabled={isSaving}
                className="px-6 py-2 text-sm font-semibold text-green-800 border border-green-900 rounded-lg
                   hover:bg-green-900 hover:text-white transition flex items-center gap-2"
              >
                <FaUserEdit />
                {isSaving
                  ? "Saving..."
                  : isEditMode
                  ? "Confirm & Update"
                  : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================
   Small UI Helpers
========================= */

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-gray-50 border border-green-900 rounded-lg p-4 space-y-2">
    <h3 className="text-xs uppercase font-semibold text-gray-600 flex items-center gap-2">
      <Icon className="text-green-700" />
      {title}
    </h3>
    {children}
  </div>
);

const Item = ({ label, value }) => (
  <p className="text-sm">
    <span className="font-semibold text-gray-700">{label}:</span>{" "}
    {typeof value === "string" || typeof value === "number" ? value : "N/A"}
  </p>
);

export default PatientsProfileReviewModal;
