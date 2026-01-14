import { waitForStableRef } from "./waitForStableRef";
import { waitForImages } from "./waitForImages";
import { exportA4ToJpg } from "./exportA4ToJpg";

export async function generateResidentA4({ frontRef, backRef, batchName }) {
  // ⏳ wait for DOM to stabilize
  await waitForStableRef(frontRef);
  await waitForStableRef(backRef);

  // ⏳ wait for images
  await waitForImages(frontRef.current);
  await waitForImages(backRef.current);

  // 🎨 export
  await exportA4ToJpg(frontRef, `${batchName}_FRONT.jpg`);
  await exportA4ToJpg(backRef, `${batchName}_BACK.jpg`);
}
