// A4Canvas.jsx
import { forwardRef } from "react";

const A4Canvas = forwardRef(({ children }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "2480px", // A4 portrait
        height: "3508px",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
});

export default A4Canvas;
