import React from "react";
import QRCode from "react-qr-code";

const IDBack = React.forwardRef(({ resident }, ref) => {
  const qrValue = resident?.alagang_valmocina_id ?? "";
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
        src="https://barangayholyspirit-media.s3.ap-southeast-1.amazonaws.com/health_and_wellness/back.jpg"
        className="absolute inset-0 w-full h-full"
        crossOrigin="anonymous"
      />

      {/* QR Code – EXACT MATCH TO TEMPLATE */}
      <div
        className="absolute overflow-hidden rounded-md bg-white"
        style={{
          left: "600px", // ← measured from back.jpg
          top: "160px", // ← measured from back.jpg
          width: "385px", // ← measured
          height: "385px", // ← measured
        }}
      >
        <div style={{ background: "white" }}>
          {qrValue && (
            <QRCode
              value={qrValue}
              style={{ width: "100%", height: "100%" }}
              size={385}
            />
          )}
        </div>
      </div>

      {/* Emergency Contact */}

      <div className="absolute left-[50px] top-[150px]">
        <p className="m-0 text-[20px] font-bold text-black uppercase">
          IN CASE OF EMERGENCY, PLEASE CONTACT:
        </p>
      </div>

      <div className="absolute left-[50px] top-[190px]">
        <p className="m-0 text-[18px] font-normal text-black leading-none">
          Emergency Contact Name:
        </p>
        <p className="text-[20px] font-bold text-black">
          {resident.emergencyContactFullName}
        </p>
      </div>

      <div className="absolute left-[50px] top-[250px]">
        <p className="m-0 text-[18px] font-normal text-black leading-none">
          Emergency Contact Number:
        </p>
        <p className="m-0 text-[20px] font-bold text-black">
          {resident.emergencyContactNumber}
        </p>
      </div>
    </div>
  );
});

export default IDBack;
