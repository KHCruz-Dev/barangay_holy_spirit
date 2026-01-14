export function waitForRef(ref, timeout = 2000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      if (ref.current) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error("Ref timeout"));
      } else {
        requestAnimationFrame(check);
      }
    };

    check();
  });
}
