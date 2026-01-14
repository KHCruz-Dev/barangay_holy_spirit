import React from "react";
import { formatLongDate } from "../../utils/dateFormatters";

const IDFront = React.forwardRef(({ resident, avatar }, ref) => {
  const buildCompleteAddress = (resident) => {
    const p = (v) =>
      v !== undefined && v !== null && String(v).trim() !== ""
        ? String(v).trim()
        : null;

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

  return (
    <div
      ref={ref}
      className="relative bg-white overflow-hidden"
      style={{
        width: "1011px",
        height: "639px",
      }}
    >
      {/* Background */}
      <img
        src="https://barangayholyspirit-media.s3.ap-southeast-1.amazonaws.com/health_and_wellness/front.jpg"
        className="absolute inset-0 w-full h-full"
        crossOrigin="anonymous"
      />

      {/* Photo Frame – EXACT MATCH to template */}
      <div
        className="absolute overflow-hidden rounded-md"
        style={{
          left: "66px", // ← measured
          top: "240px", // ← measured
          width: "320px", // ← measured
          height: "320px", // ← measured
        }}
      >
        {avatar && (
          <img
            src={avatar}
            alt="Resident"
            className="w-full h-full object-cover object-center"
            crossOrigin="anonymous"
          />
        )}
      </div>

      {/* Alagang ID */}
      <div className="absolute left-[420px] top-[240px]">
        <p className="text-[30px] font-mono font-semibold text-black">
          {resident.alagangValmocinaID}
        </p>
      </div>

      {/* Name */}
      <div className="absolute left-[420px] top-[290px] space-y-[2px]">
        <p className="m-0 text-[18px] font-normal text-black leading-none">
          Name:
        </p>
        <p className="m-0 text-[20px] font-semibold text-black uppercase leading-tight">
          {[resident.firstName, resident.middleName, resident.lastName]
            .filter(Boolean)
            .join(" ")}
        </p>
      </div>

      {/* Contact Number */}
      <div className="absolute left-[420px] top-[350px] space-y-[2px]">
        <p className="m-0 text-[18px] font-normal text-black leading-none">
          Contact No:
        </p>
        <p className="m-0 text-[20px] font-semibold text-black leading-tight">
          {resident.contactNumber}
        </p>
      </div>

      {/* Birth Date */}
      <div className="absolute left-[420px] top-[410px] space-y-[2px]">
        <p className="m-0 text-[18px] font-normal text-black leading-none">
          Birth Date:
        </p>
        <p className="m-0 text-[20px] font-semibold text-black leading-tight">
          {formatLongDate(resident.birthDate)}
        </p>
      </div>

      {/* Address */}
      <div className="absolute left-[420px] top-[470px] max-w-[520px] space-y-[2px]">
        <p className="m-0 text-[18px] font-normal text-black leading-none">
          Address:
        </p>
        <p className="m-0 text-[20px] font-semibold text-black uppercase leading-snug">
          {buildCompleteAddress(resident)}
        </p>
      </div>
    </div>
  );
});

export default IDFront;
