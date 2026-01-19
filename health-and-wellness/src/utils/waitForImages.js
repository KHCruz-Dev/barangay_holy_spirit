// utils/waitForImages.js
export async function waitForImages(container) {
  if (!container) return;

  const images = container.querySelectorAll("img");

  await Promise.all(
    Array.from(images).map((img) => {
      // Already loaded successfully
      if (img.complete && img.naturalWidth > 0) {
        return Promise.resolve();
      }

      // Wait for load or error
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // do NOT reject
      });
    })
  );
}
