"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

type CursorMode = "default" | "link" | "view" | "open";

function getCursorMode(el: HTMLElement | null): { mode: CursorMode; label: string } {
  if (!el) return { mode: "default", label: "" };

  const target =
    el.closest<HTMLElement>("[data-cursor], a, button, [role='button']") ?? el;
  const raw = target.getAttribute("data-cursor")?.toLowerCase() ?? "";
  const explicitLabel = target.getAttribute("data-cursor-label") ?? "";

  if (raw === "open") return { mode: "open", label: explicitLabel || "Open" };
  if (raw === "view") return { mode: "view", label: explicitLabel || "View" };
  if (raw === "link") return { mode: "link", label: explicitLabel };

  if (target.tagName === "A") return { mode: "link", label: explicitLabel };
  if (target.tagName === "BUTTON") return { mode: "view", label: explicitLabel || "View" };

  return { mode: "default", label: "" };
}

export default function Cursor() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const blobRef = useRef<HTMLDivElement | null>(null);
  const haloRef = useRef<HTMLDivElement | null>(null);
  const labelWrapRef = useRef<HTMLDivElement | null>(null);
  const labelInnerRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<CursorMode>("default");
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    if (reducedMotion) return;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const touchPoints = navigator.maxTouchPoints > 0;
    if (coarsePointer || touchPoints) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [reducedMotion]);

  useGSAP(
    () => {
      const scope = scopeRef.current;
      const blob = blobRef.current;
      const halo = haloRef.current;
      const labelWrap = labelWrapRef.current;
      const labelInner = labelInnerRef.current;
      if (!scope || !blob || !halo || !labelWrap || !labelInner) return;
      if (reducedMotion) return;

      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
      const touchPoints = navigator.maxTouchPoints > 0;
      if (coarsePointer || touchPoints) return;

      let hasMoved = false;

      gsap.set([blob, halo], {
        x: -9999,
        y: -9999,
        opacity: 0,
        scale: 1,
      });
      gsap.set(labelWrap, { x: -9999, y: -9999 });
      gsap.set(labelInner, { opacity: 0, y: 10, scale: 0.98 });

      const setBlobX = gsap.quickSetter(blob, "x", "px");
      const setBlobY = gsap.quickSetter(blob, "y", "px");
      const setHaloX = gsap.quickSetter(halo, "x", "px");
      const setHaloY = gsap.quickSetter(halo, "y", "px");
      const setLabelX = gsap.quickSetter(labelWrap, "x", "px");
      const setLabelY = gsap.quickSetter(labelWrap, "y", "px");

      const blobHalf = 26;
      const haloHalf = 42;

      const onMove = (e: PointerEvent) => {
        if (!hasMoved) {
          hasMoved = true;
          gsap.to([blob, halo], { opacity: 1, duration: 0.22, ease: "power2.out" });
        }

        setBlobX(e.clientX - blobHalf);
        setBlobY(e.clientY - blobHalf);
        setHaloX(e.clientX - haloHalf);
        setHaloY(e.clientY - haloHalf);

        // Float the label a bit away from cursor center.
        setLabelX(e.clientX + 18);
        setLabelY(e.clientY + 22);
      };

      const onDown = () => {
        gsap.to(blob, { scale: 0.86, duration: 0.14, ease: "power2.out", overwrite: "auto" });
        gsap.to(halo, { scale: 0.94, duration: 0.14, ease: "power2.out", overwrite: "auto" });
      };

      const onUp = () => {
        gsap.to(blob, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        gsap.to(halo, { scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      };

      const onOver = (e: PointerEvent) => {
        const t = e.target as HTMLElement | null;
        const next = getCursorMode(t);
        setMode(next.mode);
        setLabel(next.label);
      };

      const onOut = (e: PointerEvent) => {
        const rt = e.relatedTarget as HTMLElement | null;
        const next = getCursorMode(rt);
        setMode(next.mode);
        setLabel(next.label);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerout", onOut, { passive: true });

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerout", onOut);
      };
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  useEffect(() => {
    const blob = blobRef.current;
    const halo = haloRef.current;
    const labelInner = labelInnerRef.current;
    if (!blob || !halo || !labelInner) return;
    if (reducedMotion) return;

    const isInteractive = mode !== "default";
    const wantsLabel = Boolean(label) && (mode === "view" || mode === "open");

    gsap.to(blob, {
      scale: isInteractive ? 1.55 : 1,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(halo, {
      scale: isInteractive ? 1.08 : 1,
      opacity: isInteractive ? 0.75 : 0.55,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(labelInner, {
      opacity: wantsLabel ? 1 : 0,
      y: wantsLabel ? 0 : 10,
      scale: wantsLabel ? 1 : 0.98,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [label, mode, reducedMotion]);

  return (
    <div ref={scopeRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <div
        ref={haloRef}
        className="absolute left-0 top-0 h-[84px] w-[84px] rounded-full border border-white/10 opacity-0"
        style={{
          transform: "translate3d(-9999px,-9999px,0)",
          mixBlendMode: "difference",
          backdropFilter: "blur(2px)",
        }}
      />
      <div
        ref={blobRef}
        className="absolute left-0 top-0 h-[52px] w-[52px] rounded-full opacity-0"
        style={{
          transform: "translate3d(-9999px,-9999px,0)",
          background:
            "radial-gradient(circle at 30% 30%, rgba(224,255,0,0.95), rgba(224,255,0,0.25) 55%, rgba(224,255,0,0.0) 72%)",
          filter: "blur(0.2px)",
          mixBlendMode: "difference",
        }}
      />
      <div
        ref={labelWrapRef}
        className="absolute left-0 top-0"
        style={{ transform: "translate3d(-9999px,-9999px,0)" }}
      >
        <div
          ref={labelInnerRef}
          className="select-none rounded-full border border-white/10 bg-black/70 px-3 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-foreground/90 opacity-0 backdrop-blur-[2px]"
        >
          {label}
        </div>
      </div>
    </div>
  );
}

