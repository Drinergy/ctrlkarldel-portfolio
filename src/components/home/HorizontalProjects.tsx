"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
      className="flex h-full min-h-[22rem] w-full max-w-full shrink-0 self-stretch sm:min-h-[24rem] md:h-[28rem] md:min-h-0 md:w-[78vw] md:max-w-[560px]"
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
        className="relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface/70 p-5 sm:p-7 md:p-8"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(900px 520px at 10% 20%, rgba(224,255,0,0.18), rgba(224,255,0,0.0) 55%), radial-gradient(650px 420px at 80% 80%, rgba(255,255,255,0.10), rgba(255,255,255,0.0) 58%)",
          }}
        />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex min-h-[5.5rem] shrink-0 items-start justify-between gap-4">
            <div className="min-w-0 flex-1 font-display text-[clamp(22px,2.6vw,28px)] leading-[0.95] tracking-tight text-foreground/90 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
              {project.title}
            </div>
            <div className="max-w-[42%] shrink-0 pt-1 text-right font-mono text-[10px] leading-snug tracking-[0.16em] text-foreground/55 sm:text-[11px] sm:tracking-[0.2em]">
              {project.stack.slice(0, 2).join(" / ").toUpperCase()}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col pt-4">
            <p className="font-mono text-[12px] leading-relaxed tracking-[0.16em] text-foreground/65 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden md:text-[13px]">
              {project.summary}
            </p>
            <div className="mt-auto flex min-h-[3.25rem] flex-wrap content-end gap-2 pt-4">
              {project.stack.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-black/30 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-foreground/60"
                >
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex shrink-0 items-center justify-between border-t border-white/5 pt-6">
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

  const closeModal = useCallback(() => {
    setActiveProject(null);
    setFromRect(null);
  }, []);

  useEffect(() => {
    if (activeProject !== null) return;
    const el = lastFocusRef.current;
    if (!el) return;
    let cancelled = false;
    const id1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        el.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id1);
    };
  }, [activeProject]);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;

      const section = scopeRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
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
      });

      return () => mm.revert();
    },
    { scope: scopeRef, dependencies: [reducedMotion, items.length] },
  );

  return (
    <section ref={scopeRef} className="relative mt-16 overflow-hidden pt-14 sm:mt-24 sm:pt-20 md:pt-28">
      <div className="page-pad-x">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="min-w-0">
              <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55">
                SELECTED_WORK
              </div>
              <div className="mt-3 break-words font-display text-[clamp(32px,9vw,88px)] leading-[0.78] tracking-tight sm:text-[clamp(42px,6vw,88px)]">
                Selected projects, in motion.
              </div>
              <p className="mt-4 font-mono text-[12px] leading-relaxed tracking-[0.16em] text-foreground/55 md:hidden">
                Tap a card to open details. Swipe the page to continue.
              </p>
            </div>
            <div className="hidden max-w-sm font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/55 md:block">
              Scroll vertically to move horizontally. Hover a card to preview with tilt. Open for details.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-10">
        <div
          ref={trackRef}
          className="page-pad-x flex flex-col gap-6 will-change-transform md:min-h-[28rem] md:flex-row md:items-stretch md:gap-8"
          style={{ transform: "translate3d(0,0,0)" }}
        >
          <div
            className="hidden w-[max(8vw,32px)] shrink-0 md:block"
            aria-hidden="true"
          />
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
          <div
            className="hidden w-[max(18vw,96px)] shrink-0 md:block"
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />

      {activeProject && fromRect ? (
        <ProjectModal project={activeProject} fromRect={fromRect} onClose={closeModal} />
      ) : null}
    </section>
  );
}

