import { forwardRef } from "react";
import A4Canvas from "./A4Canvas";
import IDFront from "./IDFront";
import { A4_PRESETS } from "../../utils/a4Layouts";

const CARD_WIDTH = 1011;
const CARD_HEIGHT = 639;
const MARGIN = 120;
const GAP = 40;

const GenerateBulkFrontPreview = forwardRef(
  ({ residents = [], avatarMap = {}, layoutSize = 12 }, ref) => {
    const { cols } = A4_PRESETS[layoutSize];

    return (
      <A4Canvas ref={ref}>
        {residents.map((resident, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);

          const left = MARGIN + col * (CARD_WIDTH + GAP);
          const top = MARGIN + row * (CARD_HEIGHT + GAP);

          return (
            <div
              key={resident.id}
              style={{
                position: "absolute",
                left,
                top,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
              }}
            >
              <IDFront resident={resident} avatar={avatarMap[resident.id]} />
            </div>
          );
        })}
      </A4Canvas>
    );
  }
);

export default GenerateBulkFrontPreview;
