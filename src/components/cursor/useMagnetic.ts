"use client";

import { useRef } from "react";
import gsap from "gsap";

export type MagneticConfig = Readonly<{
  maxOffset?: number;
  returnDuration?: number;
}>;

export function useMagnetic<T extends HTMLElement>(
  config: MagneticConfig = {},
): Readonly<{
  ref: React.RefObject<T | null>;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerLeave: () => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
}> {
  const ref = useRef<T | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const maxOffset = config.maxOffset ?? 14;
  const returnDuration = config.returnDuration ?? 0.6;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;

    const nx = dx / (rect.width / 2);
    const ny = dy / (rect.height / 2);

    const x = nx * maxOffset;
    const y = ny * maxOffset;

    gsap.to(el, {
      x,
      y,
      duration: 0.25,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const leave = () => {
    const el = ref.current;
    if (!el) return;

    gsap.to(el, {
      x: 0,
      y: 0,
      duration: returnDuration,
      ease: "expo.out",
      overwrite: "auto",
    });
  };

  const down = () => {
    const el = ref.current;
    if (!el) return;
    tlRef.current?.kill();
    tlRef.current = gsap.timeline();
    tlRef.current.to(el, { scale: 0.985, duration: 0.14, ease: "power2.out" });
  };

  const up = () => {
    const el = ref.current;
    if (!el) return;
    tlRef.current?.kill();
    tlRef.current = gsap.timeline();
    tlRef.current.to(el, { scale: 1, duration: 0.22, ease: "power2.out" });
  };

  return {
    ref,
    onPointerMove: move,
    onPointerLeave: leave,
    onPointerDown: down,
    onPointerUp: up,
  };
}

