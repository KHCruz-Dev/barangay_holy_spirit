// utils/waitForImages.js
export async function waitForImages(container) {
  if (!container) return;

  const images = container.querySelectorAll("img");

  await Promise.all(
    Array.from(images).map(
      (img) =>
        img.complete ||
        new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        })
    )
  );
}
