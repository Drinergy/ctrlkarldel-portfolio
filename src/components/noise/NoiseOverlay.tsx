"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { registerGsapPlugins } from "@/lib/gsap";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

const NOISE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch" />
  </filter>
  <rect width="160" height="160" filter="url(#n)" opacity=".35" />
</svg>`;

function toDataUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function NoiseOverlay() {
  const reducedMotion = useReducedMotion();
  const elRef = useRef<HTMLDivElement | null>(null);

  const noiseUrl = useMemo(() => toDataUrl(NOISE_SVG), []);

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 0.08, transform: "none" });
      return;
    }

    let trigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0.08, transform: "translate3d(0,0,0)" });

      const setX = gsap.quickSetter(el, "x", "px");
      const setY = gsap.quickSetter(el, "y", "px");
      const setOpacity = gsap.quickSetter(el, "opacity", "number");

      trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress; // 0..1
          setX((p - 0.5) * 12);
          setY((p - 0.5) * -10);
          setOpacity(0.06 + p * 0.05);
        },
      });

    }, el);

    return () => {
      trigger?.kill();
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: noiseUrl,
        backgroundRepeat: "repeat",
        opacity: 0.08,
        filter: "contrast(140%)",
      }}
    />
  );
}

