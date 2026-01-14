import { toJpeg } from "html-to-image";

function waitForImages(node) {
  const images = node.querySelectorAll("img");

  return Promise.all(
    Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalHeight !== 0) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve; // still resolve to avoid freeze
          }
        })
    )
  );
}

export async function exportToJpg(ref, filename) {
  if (!ref.current) {
    console.error("Ref not ready:", filename);
    return;
  }

  await waitForImages(ref.current);

  const dataUrl = await toJpeg(ref.current, {
    quality: 0.98,
    pixelRatio: 3, // <-- sharp print
    backgroundColor: "#ffffff",
  });

  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
