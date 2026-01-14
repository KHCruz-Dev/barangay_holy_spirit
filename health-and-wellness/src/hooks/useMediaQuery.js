import { useEffect, useState } from "react";

export function useMediaQuery(query) {
  const getMatches = (q) => {
    if (typeof window !== "undefined") {
      return window.matchMedia(q).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState(getMatches(query));

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
