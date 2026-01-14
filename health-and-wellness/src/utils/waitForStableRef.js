export function waitForStableRef(ref, frames = 2) {
  return new Promise((resolve) => {
    let count = 0;

    const check = () => {
      if (ref.current) {
        count++;
        if (count >= frames) {
          resolve();
          return;
        }
      } else {
        count = 0;
      }
      requestAnimationFrame(check);
    };

    check();
  });
}
