"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { registerGsapPlugins } from "@/lib/gsap";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

export default function RouteTransition({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const mountedRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const prefersBlackOverlay = useMemo(() => true, []);

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const overlayEl = overlayRef.current;
    const scopeEl = scopeRef.current;
    if (!overlayEl || !scopeEl) return;

    const ctx = gsap.context(() => {
      timelineRef.current?.kill();

      gsap.set(overlayEl, {
        autoAlpha: 1,
        scaleY: 0,
        transformOrigin: "top",
        backgroundColor: prefersBlackOverlay ? "#000000" : undefined,
      });

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.to(overlayEl, {
        scaleY: 1,
        duration: 0.65,
        ease: "expo.out",
      })
        .to(
          overlayEl,
          {
            scaleY: 0,
            duration: 0.75,
            ease: "expo.out",
            onComplete: () => {
              // Ensure any ScrollTrigger instances re-measure after navigation.
              // `refresh()` is safe even if no triggers exist yet.
              ScrollTrigger.refresh();
            },
          },
          "-=0.05",
        )
        .set(overlayEl, { autoAlpha: 0 });
    }, scopeEl);

    return () => {
      ctx.revert();
    };
  }, [pathname, reducedMotion, prefersBlackOverlay]);

  return (
    <div ref={scopeRef}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-50 pointer-events-none origin-top"
        style={{ transform: "scaleY(0)", backgroundColor: "#000000" }}
      />
    </div>
  );
}

