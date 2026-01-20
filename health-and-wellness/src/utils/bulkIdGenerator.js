import { waitForStableRef } from "./waitForStableRef";
import { waitForImages } from "./waitForImages";
import { exportA4ToJpg } from "./exportA4ToJpg";

export async function generateResidentA4({ frontRef, backRef, batchName }) {
  // ⏳ wait for DOM
  await waitForStableRef(frontRef);
  await waitForStableRef(backRef);

  await waitForImages(frontRef.current);
  await waitForImages(backRef.current);

  // 🖨 EXPORT FRONT
  await exportA4ToJpg(frontRef, `${batchName}_FRONT.jpg`);

  // 🔑 LET BROWSER BREATHE
  await new Promise((r) => setTimeout(r, 300));

  // 🖨 EXPORT BACK
  await exportA4ToJpg(backRef, `${batchName}_BACK.jpg`);

  // 🔑 LET BROWSER BREATHE AGAIN
  await new Promise((r) => setTimeout(r, 300));
}
