"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsapPlugins } from "@/lib/gsap";
import type { PortfolioProject } from "@/components/content/portfolio-content";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import ProjectModal from "@/components/projects/ProjectModal";

type RectLike = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

function TiltCard({
  project,
  onOpen,
}: Readonly<{
  project: PortfolioProject;
  onOpen: (project: PortfolioProject, fromRect: RectLike) => void;
}>) {
  const reducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLButtonElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  const isInteractivePointer = () =>
    !(window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0);

  useGSAP(
    () => {
      const card = cardRef.current;
      const inner = innerRef.current;
      if (!card || !inner) return;
      if (reducedMotion) return;
      if (typeof window === "undefined") return;
      if (!isInteractivePointer()) return;

      const setRX = gsap.quickSetter(inner, "rotateX", "deg");
      const setRY = gsap.quickSetter(inner, "rotateY", "deg");
      const setTZ = gsap.quickSetter(inner, "translateZ", "px");

      gsap.set(inner, { transformPerspective: 900, transformOrigin: "center" });

      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const ry = (px - 0.5) * 10;
        const rx = -(py - 0.5) * 8;
        setRX(rx);
        setRY(ry);
        setTZ(18);
      };

      const onLeave = () => {
        gsap.to(inner, {
          rotateX: 0,
          rotateY: 0,
          translateZ: 0,
          duration: 0.8,
          ease: "expo.out",
          overwrite: "auto",
        });
      };

      card.addEventListener("pointermove", onMove, { passive: true });
      card.addEventListener("pointerleave", onLeave);
      return () => {
        card.removeEventListener("pointermove", onMove);
        card.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: cardRef, dependencies: [reducedMotion] },
  );

  return (
    <button
      ref={cardRef}
      type="button"
      className="h-full w-[78vw] max-w-[560px] shrink-0"
      data-cursor="open"
      data-cursor-label="Open"
      onClick={() => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        onOpen(project, { left: r.left, top: r.top, width: r.width, height: r.height });
      }}
    >
      <div
        ref={innerRef}
        className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-surface/70 p-7"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(900px 520px at 10% 20%, rgba(224,255,0,0.18), rgba(224,255,0,0.0) 55%), radial-gradient(650px 420px at 80% 80%, rgba(255,255,255,0.10), rgba(255,255,255,0.0) 58%)",
          }}
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="font-display text-[28px] leading-[0.9] tracking-tight text-foreground/90">
              {project.title}
            </div>
            <div className="font-mono text-[11px] tracking-[0.24em] text-foreground/55">
              {project.stack.slice(0, 2).join(" / ").toUpperCase()}
            </div>
          </div>

          <div className="mt-4 font-mono text-[12px] leading-relaxed tracking-[0.16em] text-foreground/65 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
            {project.summary}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-foreground/60"
              >
                {t.toUpperCase()}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-10 flex items-center justify-between">
            <div className="font-mono text-[11px] tracking-[0.22em] text-foreground/55">
              TILT_ON_HOVER
            </div>
            <div className="font-mono text-[11px] tracking-[0.22em] text-accent/80">
              OPEN
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function HorizontalProjects({
  projects,
}: Readonly<{
  projects: ReadonlyArray<PortfolioProject>;
}>) {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const items = useMemo(() => projects.slice(0, Math.max(2, projects.length)), [projects]);

  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [fromRect, setFromRect] = useState<RectLike | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;

      const section = scopeRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const getDistance = () => {
        const vw = window.innerWidth;
        const total = track.scrollWidth;
        return Math.max(0, total - vw);
      };

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        overwrite: "auto",
      });

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${getDistance() + window.innerHeight * 0.35}`,
        scrub: 0.9,
        pin: true,
        anticipatePin: 1,
        animation: tween,
        invalidateOnRefresh: true,
      });

      return () => {
        st.kill();
        tween.kill();
      };
    },
    { scope: scopeRef, dependencies: [reducedMotion, items.length] },
  );

  return (
    <section ref={scopeRef} className="relative mt-24 overflow-hidden pt-20 md:pt-28">
      <div className="px-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex items-end justify-between gap-10">
            <div>
              <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55">
                SELECTED_WORK
              </div>
              <div className="mt-3 font-display text-[clamp(42px,6vw,88px)] leading-[0.78] tracking-tight">
                Selected projects, in motion.
              </div>
            </div>
            <div className="hidden md:block max-w-sm font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/55">
              Scroll vertically to move horizontally. Hover a card to preview with tilt. Open for details.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div
          ref={trackRef}
          className="flex items-stretch gap-6 px-6 will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <div className="w-[max(8vw,32px)] shrink-0" aria-hidden="true" />
          {items.map((p) => (
            <TiltCard
              key={p.title}
              project={p}
              onOpen={(proj, rect) => {
                lastFocusRef.current = document.activeElement as HTMLElement | null;
                setActiveProject(proj);
                setFromRect(rect);
              }}
            />
          ))}
          <div className="w-[max(18vw,96px)] shrink-0" aria-hidden="true" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      {activeProject && fromRect ? (
        <ProjectModal
          project={activeProject}
          fromRect={fromRect}
          onClose={() => {
            setActiveProject(null);
            setFromRect(null);
            lastFocusRef.current?.focus?.();
          }}
        />
      ) : null}
    </section>
  );
}

