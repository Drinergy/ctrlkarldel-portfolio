"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import type { PortfolioProject } from "@/components/content/portfolio-content";

type RectLike = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

export default function ProjectCard({
  project,
  onOpen,
}: Readonly<{
  project: PortfolioProject;
  onOpen: (project: PortfolioProject, fromRect: RectLike) => void;
}>) {
  const reducedMotion = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const arrowRef = useRef<HTMLSpanElement | null>(null);

  const maxOffset = useMemo(() => 12, []);

  useEffect(() => {
    if (reducedMotion) return;

    const btn = btnRef.current;
    const arrow = arrowRef.current;
    if (!btn) return;

    const setX = gsap.quickSetter(btn, "x", "px");
    const setY = gsap.quickSetter(btn, "y", "px");
    const scaleTo = gsap.quickTo(btn, "scale", {
      duration: 0.18,
      ease: "power2.out",
      overwrite: "auto",
    });

    const handleMove = (e: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const nx = dx / (rect.width / 2);
      const ny = dy / (rect.height / 2);

      setX(nx * maxOffset);
      setY(ny * maxOffset);
    };

    const handleLeave = () => {
      setX(0);
      setY(0);
      scaleTo(1);
    };

    const handleEnter = () => {
      if (!arrow) return;
      gsap.to(arrow, { opacity: 1, duration: 0.22, ease: "power2.out" });
    };

    const handleDown = () => {
      scaleTo(0.99);
      if (arrow) {
        gsap.to(arrow, { opacity: 0.85, duration: 0.12, ease: "power2.out" });
      }
    };

    const handleUp = () => {
      scaleTo(1);
      if (arrow) {
        gsap.to(arrow, { opacity: 1, duration: 0.18, ease: "power2.out" });
      }
    };

    btn.addEventListener("pointermove", handleMove, { passive: true });
    btn.addEventListener("pointerleave", handleLeave);
    btn.addEventListener("pointerenter", handleEnter);
    btn.addEventListener("pointerdown", handleDown, { passive: true });
    btn.addEventListener("pointerup", handleUp, { passive: true });
    btn.addEventListener("pointercancel", handleUp, { passive: true });

    return () => {
      btn.removeEventListener("pointermove", handleMove);
      btn.removeEventListener("pointerleave", handleLeave);
      btn.removeEventListener("pointerenter", handleEnter);
      btn.removeEventListener("pointerdown", handleDown);
      btn.removeEventListener("pointerup", handleUp);
      btn.removeEventListener("pointercancel", handleUp);
    };
  }, [maxOffset, reducedMotion]);

  return (
    <button
      ref={btnRef}
      type="button"
      data-cursor="open"
      data-cursor-label="Open"
      className="group w-full rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-left transition-[transform,opacity,border-color,background-color] duration-300 hover:border-white/20 hover:bg-white/[0.03] active:scale-[0.99] md:p-9"
      onClick={() => {
        const btn = btnRef.current;
        if (!btn) return;
        const r = btn.getBoundingClientRect();
        onOpen(project, { left: r.left, top: r.top, width: r.width, height: r.height });
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="font-display text-[clamp(24px,2.4vw,32px)] leading-[0.92] tracking-tight text-foreground/92">
            {project.title}
          </div>
          <p className="font-mono text-[13px] leading-relaxed tracking-[0.14em] text-foreground/68 md:text-[14px]">
            {project.summary}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-black/20 px-3.5 py-1.5 font-mono text-[11px] tracking-[0.2em] text-foreground/65"
              >
                {t.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:justify-between">
          <span
            ref={arrowRef}
            className="opacity-0 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/20 text-foreground/90 transition-transform group-hover:translate-x-0"
            style={{ transform: "translateX(-6px)" }}
            aria-hidden="true"
          >
            →
          </span>
        </div>
      </div>
    </button>
  );
}

