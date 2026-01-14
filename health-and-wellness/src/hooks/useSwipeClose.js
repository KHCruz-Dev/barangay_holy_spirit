import { useRef } from "react";

export function useSwipeClose(onClose, threshold = 80) {
  const startX = useRef(null);

  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    if (startX.current === null) return;

    const diff = startX.current - e.touches[0].clientX;
    if (diff > threshold) {
      onClose();
      startX.current = null;
    }
  };

  const onTouchEnd = () => {
    startX.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };
}
