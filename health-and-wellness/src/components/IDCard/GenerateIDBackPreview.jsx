import { forwardRef } from "react";
import A4Canvas from "./A4Canvas";
import IDBack from "./IDBack";

const CARD_WIDTH = 1011; // landscape
const CARD_HEIGHT = 639;

const GenerateIDBackPreview = forwardRef(({ resident }, ref) => {
  if (!resident) return <div ref={ref} />;

  return (
    <A4Canvas ref={ref}>
      {/* CARD 1 */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "120px",
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
        }}
      >
        <IDBack resident={resident} />
      </div>

      {/* OPTIONAL CARD 2 */}
      {/* Duplicate when ready */}
    </A4Canvas>
  );
});

export default GenerateIDBackPreview;
