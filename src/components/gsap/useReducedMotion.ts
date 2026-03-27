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
    const STORAGE_KEY = "portfolio-motion";
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");

    const resolvePreference = () => {
      const url = new URL(window.location.href);
      const queryMotion = url.searchParams.get("motion");
      if (queryMotion === "on") {
        window.localStorage.setItem(STORAGE_KEY, "on");
        return false;
      }
      if (queryMotion === "off") {
        window.localStorage.setItem(STORAGE_KEY, "off");
        return true;
      }

      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "on") return false;
      if (saved === "off") return true;

      return mql.matches;
    };

    const update = () => setReduced(resolvePreference());
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

