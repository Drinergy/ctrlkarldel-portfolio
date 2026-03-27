"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "@/lib/splitText";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

export default function Preloader({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const pctRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ready) return;
    // Lock scroll while the intro is running.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [ready]);

  useGSAP(
    () => {
      if (reducedMotion) {
        setReady(true);
        return;
      }

      const scope = scopeRef.current;
      const bar = progressRef.current;
      const pct = pctRef.current;
      if (!scope || !bar || !pct) return;

      const chars = Array.from(scope.querySelectorAll<HTMLElement>("[data-split]"));

      const state = { p: 0 };
      const setBar = gsap.quickSetter(bar, "scaleX");
      const setPct = (n: number) => {
        pct.textContent = `${Math.round(n)}%`;
      };

      gsap.set(scope, { autoAlpha: 1 });
      gsap.set(bar, { transformOrigin: "left", scaleX: 0 });
      gsap.set(chars, { y: 24, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: () => setReady(true),
      });

      tl.to(chars, { y: 0, opacity: 1, duration: 0.9, stagger: 0.02 }, 0);

      // Deterministic "progress illusion".
      tl.to(
        state,
        {
          p: 100,
          duration: 1.35,
          ease: "power2.out",
          onUpdate: () => {
            setBar(state.p / 100);
            setPct(state.p);
          },
        },
        0.05,
      );

      tl.to(scope, { autoAlpha: 0, duration: 0.55, ease: "power2.out" }, 1.2);
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <>
      {!ready ? (
        <div
          ref={scopeRef}
          className="fixed inset-0 z-[80] grid place-items-center bg-background opacity-0"
          aria-label="Loading"
          role="status"
        >
          <div className="w-full max-w-xl px-6">
            <div className="flex items-end justify-between gap-6">
              <div className="text-[clamp(40px,6vw,84px)] leading-[0.85] tracking-tight font-display">
                <SplitText
                  text="Loading portfolio"
                  unit="word"
                  itemClassName="inline-block mr-[0.22em] last:mr-0 will-change-transform"
                />
              </div>
              <div
                ref={pctRef}
                className="pb-2 font-mono text-[12px] tracking-[0.28em] text-foreground/70"
              >
                0%
              </div>
            </div>

            <div className="mt-6 h-px w-full bg-white/10">
              <div ref={progressRef} className="h-px w-full bg-accent" />
            </div>

            <div className="mt-4 font-mono text-[11px] tracking-[0.24em] text-foreground/50">
              PERFORMANCE · ACCESSIBILITY · MOTION_SYSTEM
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </>
  );
}

