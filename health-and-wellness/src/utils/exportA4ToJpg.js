// utils/exportA4ToJpg.js
import { toBlob } from "html-to-image";

export async function exportA4ToJpg(a4Ref, filename) {
  if (!a4Ref?.current) {
    throw new Error("A4 canvas not mounted");
  }

  // 1️⃣ Render DOM → Blob
  const blob = await toBlob(a4Ref.current, {
    backgroundColor: "#ffffff",
    cacheBust: true,
    useCORS: true,
    pixelRatio: 1,
  });

  if (!blob) {
    throw new Error("Failed to generate image blob");
  }

  // 2️⃣ Load into Image
  const img = new Image();
  img.src = URL.createObjectURL(blob);
  await img.decode();

  // 3️⃣ Re-encode via Canvas (forces baseline JPEG)
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);

  // 4️⃣ Export as legacy-safe JPEG
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);

  // 5️⃣ Download
  const link = document.createElement("a");
  link.href = jpegDataUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(img.src);
}
