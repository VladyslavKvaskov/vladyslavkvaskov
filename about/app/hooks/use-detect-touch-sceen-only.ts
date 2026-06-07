import { useEffect, useState } from "react";

export const useDetextTouchScreenOnly = () => {
  const [isTouchScreen, setIsTouchScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const update = (e: MediaQueryListEvent | MediaQueryList) =>
      setIsTouchScreen(e.matches);

    update(mediaQuery);
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isTouchScreen;
};
