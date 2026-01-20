import React, { useEffect } from "react";
import {
  FaBirthdayCake,
  FaUserClock,
  FaVenusMars,
  FaRing,
  FaPhone,
  FaIdBadge,
  FaIdCard,
  FaMapMarkerAlt,
} from "react-icons/fa";

import pf1 from "../../../../assets/images/pf-1.jpg";
import pm1 from "../../../../assets/images/pm-1.jpg";
import pm2 from "../../../../assets/images/pm-2.jpg";

const API_URL = import.meta.env.VITE_API_URL;

/* =========================
   Avatar Helpers
========================= */

const getDefaultAvatarForResident = (resident) => {
  const gender = (resident.gender || "").toLowerCase();
  if (gender === "female") return pf1;
  if (gender === "male") return pm1;
  return pm2;
};

const getBackendBaseUrl = () => {
  if (!API_URL) return "";
  let base = API_URL.replace(/\/+$/, "");
  base = base.replace(/\/api$/, "");
  return base;
};

const resolveAvatarSrc = (resident) => {
  const fallback = getDefaultAvatarForResident(resident);

  // raw image url from backend (S3 or relative)
  const raw = resident.img_url;

  if (!raw || typeof raw !== "string") return fallback;

  // 🔥 cache-bust so updated images refetch
  const withCacheBust = `${raw}?v=${Date.now()}`;

  // absolute S3 / http url
  if (raw.startsWith("http")) return withCacheBust;

  // relative path → prefix backend base
  const base = getBackendBaseUrl();
  if (!base) return fallback;

  return `${base}${raw.startsWith("/") ? raw : `/${raw}`}?v=${Date.now()}`;
};

/* =========================
   Data Helpers
========================= */

const getFullName = (resident) =>
  [
    resident.prefix,
    resident.first_name,
    resident.middle_name,
    resident.last_name,
    resident.suffix,
  ]
    .filter(Boolean)
    .join(" ");

const calculateAge = (birthdate) => {
  if (!birthdate) return null;
  const dob = new Date(birthdate);
  if (isNaN(dob.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
};

const formatBirthdate = (birthdate) => {
  if (!birthdate) return "N/A";
  const d = new Date(birthdate);
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

// Complete Address
const buildCompleteAddress = (resident) => {
  const p = (v) =>
    v !== undefined && v !== null && String(v).trim() !== ""
      ? String(v).trim()
      : null;

  // Line 1: Street + Subdivision
  const line1 = [p(resident.gis_street_name), p(resident.gis_subdivision_name)]
    .filter(Boolean)
    .join(", ");

  // Line 2: Barangay → City → Province → Region
  const line2 = [
    p(resident.gis_barangay_name),
    p(resident.gis_municipality_name),
    p(resident.gis_province_name),
    p(resident.gis_region_name),
  ]
    .filter(Boolean)
    .join(", ");

  if (line1 && line2) return `${line1}, ${line2}`;
  return line1 || line2 || "N/A";
};

/* =========================
   Detail Row
========================= */

const DetailRow = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    {/* Icon */}
    <div className="w-5 flex justify-center mt-1 text-gray-400">{icon}</div>

    {/* Text */}
    <div className="flex flex-col text-left">
      <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
        {label}
      </span>
      <span className="text-sm leading-tight text-gray-800">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

/* =========================
   MAIN CARD
========================= */

const PatientsProfileCard = ({ resident, onEdit }) => {
  const fullName = getFullName(resident) || "Unnamed Resident";
  const age = calculateAge(resident.birthdate);
  const birthdate = formatBirthdate(resident.birthdate);
  const avatarSrc = resolveAvatarSrc(resident);
  const defaultAvatar = getDefaultAvatarForResident(resident);

  const alagangId = resident.alagang_valmocina_id || "N/A";
  const idPrinted = resident.is_id_printed === true;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onEdit(resident)}
      className="relative bg-white text-gray-800 border border-gray-200 rounded-xl p-5 shadow-sm cursor-pointer flex flex-col items-center text-center gap-3 transition hover:border-green-700 hover:shadow-md focus-visible:ring-2 focus-visible:ring-green-700
  "
    >
      {/* Record Type Badge */}
      <div className="absolute top-3 right-3">
        <span
          className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${
            resident.is_non_resident
              ? "border-orange-500 text-orange-600 bg-orange-50"
              : "border-green-700 text-green-800 bg-green-50"
          }`}
        >
          {resident.is_non_resident ? "NON-RESIDENT" : "RESIDENT"}
        </span>
      </div>

      {/* Avatar */}
      <img
        src={avatarSrc}
        alt={fullName}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = defaultAvatar;
        }}
        className="rounded-full w-20 h-20 md:w-24 md:h-24 object-cover border-2 border-green-800 transition-colors"
      />

      {/* Name */}
      <h3 className="text-base font-semibold">{fullName}</h3>

      {/* Address */}
      <div className="flex items-start gap-0 text-xs text-gray-500 max-w-full">
        <p className="leading-snug text-center line-clamp-2">
          {resident.complete_address || "N/A"}
        </p>
      </div>

      <hr className="w-12 border-current opacity-30 my-1" />

      {/* Details */}
      <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-10 py-3 grid grid-cols-2 gap-x-6 gap-y-4">
        <DetailRow
          icon={<FaBirthdayCake />}
          label="Birthdate"
          value={birthdate}
        />
        <DetailRow
          icon={<FaUserClock />}
          label="Age"
          value={age !== null ? `${age} yrs` : "N/A"}
        />
        <DetailRow
          icon={<FaVenusMars />}
          label="Gender"
          value={resident.gender}
        />
        <DetailRow
          icon={<FaRing />}
          label="Civil Status"
          value={resident.civil_status}
        />

        {/* Desktop-only */}
        <div className="hidden md:block">
          <DetailRow
            icon={<FaPhone />}
            label="Contact"
            value={resident.contact_number}
          />
        </div>
        <div className="hidden md:block">
          <DetailRow
            icon={<FaIdBadge />}
            label="ID Printed"
            value={idPrinted ? "Yes" : "No"}
          />
        </div>
      </div>

      <hr className="w-12 border-current opacity-30 my-1" />

      {/* Alagang ID */}
      <div className="w-full mt-3 pt-2 border-t border-gray-200 flex items-center justify-center gap-2 text-xs font-medium text-gray-600">
        <FaIdCard className="opacity-60" />
        <span>Alagang ID: {alagangId}</span>
      </div>
    </div>
  );
};

export default PatientsProfileCard;
