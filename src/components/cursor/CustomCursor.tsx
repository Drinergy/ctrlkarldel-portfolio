"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { registerGsapPlugins } from "@/lib/gsap";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

type CursorMode = "default" | "link" | "view" | "open";

function getCursorMode(el: HTMLElement | null): { mode: CursorMode; label: string } {
  if (!el) return { mode: "default", label: "" };

  const target =
    el.closest<HTMLElement>("[data-cursor], a, button, [role='button']") ?? el;
  const raw = target.getAttribute("data-cursor")?.toLowerCase() ?? "";
  const explicitLabel = target.getAttribute("data-cursor-label") ?? "";

  // Labels should be opt-in to avoid redundancy (e.g. menu items already show text).
  if (raw === "open") return { mode: "open", label: explicitLabel };
  if (raw === "view") return { mode: "view", label: explicitLabel };
  if (raw === "link") return { mode: "link", label: explicitLabel };

  if (target.tagName === "A") return { mode: "link", label: explicitLabel };
  if (target.tagName === "BUTTON") return { mode: "view", label: explicitLabel };

  return { mode: "default", label: "" };
}

export default function CustomCursor() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const cursorLabelRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    const dotEl = cursorDotRef.current;
    const ringEl = cursorRingRef.current;
    const labelEl = cursorLabelRef.current;
    const scopeEl = scopeRef.current;
    if (!dotEl || !ringEl || !labelEl || !scopeEl) return;

    // Start hidden; reveal on the first pointer move.
    gsap.set([dotEl, ringEl], { x: -9999, y: -9999, opacity: 0, scale: 1 });
    gsap.set(labelEl, { opacity: 0, scale: 0.98, y: 8 });
    if (reducedMotion) return;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const touchPoints = navigator.maxTouchPoints > 0;
    if (coarsePointer || touchPoints) return;

    document.documentElement.classList.add("has-custom-cursor");

    let hasMoved = false;
    const pointer = { x: 0, y: 0 };
    const ringHalf = 14; // 28px / 2
    const dotHalf = 5; // 10px / 2

    const ctx = gsap.context(() => {
      const dotX = gsap.quickTo(dotEl, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dotEl, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ringEl, "x", { duration: 0.22, ease: "power3.out" });
      const ringY = gsap.quickTo(ringEl, "y", { duration: 0.22, ease: "power3.out" });
      const labelX = gsap.quickTo(labelEl, "x", { duration: 0.26, ease: "power3.out" });
      const labelY = gsap.quickTo(labelEl, "y", { duration: 0.26, ease: "power3.out" });

      const handleMove = (e: PointerEvent) => {
        pointer.x = e.clientX;
        pointer.y = e.clientY;

        // Reveal cursor only after the first move to avoid "flash" at hydration.
        if (!hasMoved) {
          hasMoved = true;
          gsap.to([dotEl, ringEl], { opacity: 1, duration: 0.2, ease: "power2.out" });
        }

        dotX(pointer.x - dotHalf);
        dotY(pointer.y - dotHalf);
        ringX(pointer.x - ringHalf);
        ringY(pointer.y - ringHalf);

        // Label follows slightly behind the ring for depth.
        labelX(pointer.x + 14);
        labelY(pointer.y + 18);
      };

      const handleDown = () => {
        gsap.to(ringEl, { scale: 0.86, duration: 0.12, ease: "power2.out" });
        gsap.to(dotEl, { scale: 0.9, duration: 0.12, ease: "power2.out" });
      };

      const handleUp = () => {
        gsap.to(ringEl, { scale: 1, duration: 0.18, ease: "power2.out" });
        gsap.to(dotEl, { scale: 1, duration: 0.18, ease: "power2.out" });
      };

      const handleOver = (e: PointerEvent) => {
        const t = e.target as HTMLElement | null;
        const next = getCursorMode(t);
        setMode(next.mode);
        setLabel(next.label);
      };

      const handleOut = (e: PointerEvent) => {
        const rt = e.relatedTarget as HTMLElement | null;
        const next = getCursorMode(rt);
        setMode(next.mode);
        setLabel(next.label);
      };

      window.addEventListener("pointermove", handleMove, { passive: true });
      window.addEventListener("pointerdown", handleDown, { passive: true });
      window.addEventListener("pointerup", handleUp, { passive: true });
      window.addEventListener("pointerover", handleOver, { passive: true });
      window.addEventListener("pointerout", handleOut, { passive: true });

      return () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerdown", handleDown);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointerover", handleOver);
        window.removeEventListener("pointerout", handleOut);
      };
    }, scopeEl);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      ctx.revert();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const ringEl = cursorRingRef.current;
    const labelEl = cursorLabelRef.current;
    if (!ringEl || !labelEl) return;

    const isInteractive = mode !== "default";
    const wantsLabel = Boolean(label) && (mode === "view" || mode === "open");

    gsap.to(ringEl, {
      scale: isInteractive ? 1.35 : 1,
      opacity: isInteractive ? 0.95 : 0.75,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(labelEl, {
      opacity: wantsLabel ? 1 : 0,
      y: wantsLabel ? 0 : 8,
      scale: wantsLabel ? 1 : 0.98,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [label, mode]);

  return (
    <div ref={scopeRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110]">
      <div
        ref={cursorRingRef}
        className="absolute left-0 top-0 h-7 w-7 rounded-full border border-white/75 opacity-0"
      />
      <div
        ref={cursorDotRef}
        className="absolute left-0 top-0 h-[10px] w-[10px] rounded-full bg-white/85 opacity-0"
      />
      <div
        ref={cursorLabelRef}
        className="absolute left-0 top-0 select-none rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-foreground/90 opacity-0 backdrop-blur-[2px]"
        style={{ transform: "translate3d(-9999px,-9999px,0)" }}
      >
        {label}
      </div>
    </div>
  );
}

