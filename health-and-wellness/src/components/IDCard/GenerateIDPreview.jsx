// components/ID/GenerateIDPreview.jsx
import { forwardRef } from "react";
import A4Canvas from "./A4Canvas";
import IDCard from "./IDCard";
import IDFront from "./IDFront";
// import IDBack from "./IDBack";

const GenerateIDPreview = forwardRef(({ resident, avatar }, ref) => {
  if (!resident) {
    // IMPORTANT: keep ref mounted
    return <div ref={ref} />;
  }

  return (
    <A4Canvas ref={ref}>
      {/* FRONT ID — LANDSCAPE */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "120px",
        }}
      >
        <IDCard>
          <IDFront resident={resident} avatar={avatar} />
        </IDCard>
      </div>

      {/* BACK ID — enable later */}
      {/*
      <div style={{ position: "absolute", top: "820px", left: "120px" }}>
        <IDCard>
          <IDBack resident={resident} />
        </IDCard>
      </div>
      */}
    </A4Canvas>
  );
});

export default GenerateIDPreview;
