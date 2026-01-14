import React from "react";
import { formatLongDate } from "../../utils/dateFormatters";

const IDFrontPortrait = ({ resident, avatar }) => {
  return (
    <div
      style={{
        width: "638px",
        height: "1004px",
        position: "relative",
        background: "#fff",
        overflow: "hidden",
      }}
    >
      {/* Background — PRE-ROTATED IMAGE */}
      <img
        src="/images/id-templates/front-portrait.jpg"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
        crossOrigin="anonymous"
      />

      {/* ALL POSITIONS MEASURED FOR PORTRAIT */}
      {/* Photo */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 160,
          width: 260,
          height: 260,
        }}
      >
        <img
          src={avatar}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Name */}
      <div style={{ position: "absolute", left: 340, top: 220 }}>
        <div style={{ fontSize: 18 }}>Name:</div>
        <div style={{ fontSize: 20, fontWeight: "bold" }}>
          {resident.firstName} {resident.lastName}
        </div>
      </div>

      {/* Continue mapping fields */}
    </div>
  );
};

export default IDFrontPortrait;
