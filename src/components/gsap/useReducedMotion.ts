"use client";

import { useEffect, useState } from "react";

/**
 * Detects whether the user prefers reduced motion.
 *
 * Used to disable or simplify GSAP effects on accessibility grounds.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setReduced(mql.matches);
    update();

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", update);
      return () => mql.removeEventListener("change", update);
    }

    // Safari < 14 fallback.
    const legacyMql = mql as unknown as {
      addListener?: (listener: () => void) => void;
      removeListener?: (listener: () => void) => void;
    };

    legacyMql.addListener?.(update);
    return () => legacyMql.removeListener?.(update);
  }, []);

  return reduced;
}

