import React, { useEffect, useRef } from "react";
import QRCode from "qrcode";

const IDBack = React.forwardRef(({ resident }, ref) => {
  const canvasRef = useRef(null);

  const qrValue = resident?.alagangValmocinaID ?? "";

  const safe = (v) =>
    v !== undefined && v !== null && String(v).trim() !== ""
      ? String(v)
      : "N/A";

  // ✅ Render QR into CANVAS (not SVG)
  useEffect(() => {
    if (qrValue && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrValue, {
        width: 385,
        margin: 0,
        errorCorrectionLevel: "H",
      });
    }
  }, [qrValue]);

  return (
    <div
      ref={ref}
      className="relative bg-white overflow-hidden"
      style={{ width: "1011px", height: "639px" }}
    >
      {/* Background */}
      <img
        src="https://barangayholyspirit-media.s3.ap-southeast-1.amazonaws.com/health_and_wellness/back.jpg"
        className="absolute inset-0 w-full h-full"
        crossOrigin="anonymous"
      />

      {/* ✅ QR CODE (CANVAS — EXPORT SAFE) */}
      <canvas
        ref={canvasRef}
        width={385}
        height={385}
        className="absolute bg-white rounded-md"
        style={{
          left: "600px",
          top: "160px",
        }}
      />

      {/* Emergency Contact Header */}
      <div className="absolute left-[50px] top-[150px]">
        <p className="m-0 text-[20px] font-bold text-black uppercase">
          IN CASE OF EMERGENCY, PLEASE CONTACT:
        </p>
      </div>

      {/* Emergency Contact Name */}
      <div className="absolute left-[50px] top-[190px]">
        <p className="m-0 text-[18px] text-black leading-none">
          Emergency Contact Name:
        </p>
        <p className="m-0 text-[20px] font-bold text-black">
          {safe(resident.emergencyContactFullName)}
        </p>
      </div>

      {/* Emergency Contact Number */}
      <div className="absolute left-[50px] top-[250px]">
        <p className="m-0 text-[18px] text-black leading-none">
          Emergency Contact Number:
        </p>
        <p className="m-0 text-[20px] font-bold text-black">
          {safe(resident.emergencyContactNumber)}
        </p>
      </div>
    </div>
  );
});

export default IDBack;
