"use client";

import { useEffect, useMemo, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import { registerGsapPlugins } from "@/lib/gsap";

export default function SmoothScrollProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  const rootStyle = useMemo<React.CSSProperties>(
    () => ({
      // Avoid scroll chaining and keep touch feel controlled.
      overscrollBehavior: "none",
    }),
    [],
  );

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      // Keep this subtle; we'll let GSAP do the cinematic work.
      smoothWheel: true,
      syncTouch: true,
      lerp: 0.085,
    });

    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      // Lenis expects time in ms.
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    // Initial measurement after hydration.
    ScrollTrigger.refresh(true);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return (
    <div style={rootStyle} data-lenis-root>
      {children}
    </div>
  );
}

