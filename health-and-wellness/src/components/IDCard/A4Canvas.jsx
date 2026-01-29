// A4Canvas.jsx
import { forwardRef } from "react";

const A4Canvas = forwardRef(({ children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "4724px",
        height: "3425px",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",

        /* 🔒 PRINT-SAFE FIXES */
        transform: "scale(1)",
        transformOrigin: "top left",
        imageRendering: "crisp-edges",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {children}
    </div>
  );
});

export default A4Canvas;
