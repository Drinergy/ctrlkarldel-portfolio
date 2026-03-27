"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import type { PortfolioProject } from "@/components/content/portfolio-content";

type RectLike = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

function getFocusable(root: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  return Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
  );
}

export default function ProjectModal({
  project,
  fromRect,
  onClose,
}: Readonly<{
  project: PortfolioProject;
  fromRect: RectLike;
  onClose: () => void;
}>) {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  /** GSAP transform target (must not be the overflow scroll node — fixes iOS scroll). */
  const animRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const introTlRef = useRef<gsap.core.Timeline | null>(null);

  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  useEffect(() => {
    closingRef.current = closing;
  }, [closing]);

  useLayoutEffect(() => {
    if (reducedMotion) {
      closeBtnRef.current?.focus();
      return;
    }

    const animEl = animRef.current;
    const overlayEl = overlayRef.current;
    const contentEl = contentRef.current;
    if (!animEl || !overlayEl) return;

    gsap.killTweensOf([animEl, overlayEl, contentEl].filter(Boolean));

    const toRect = animEl.getBoundingClientRect();

    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    const sx = fromRect.width / toRect.width;
    const sy = fromRect.height / toRect.height;

    gsap.set(overlayEl, { autoAlpha: 0 });
    gsap.set(animEl, {
      transformOrigin: "50% 50%",
      x: dx,
      y: dy,
      scaleX: sx,
      scaleY: sy,
    });

    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    introTlRef.current = tl;
    tl.to(overlayEl, { autoAlpha: 1, duration: 0.22 });
    tl.to(
      animEl,
      {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.65,
      },
      "-=0.05",
    );
    if (contentEl) {
      tl.fromTo(
        contentEl,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        "-=0.5",
      );
    }

    closeBtnRef.current?.focus();

    return () => {
      tl.kill();
      if (introTlRef.current === tl) introTlRef.current = null;
      gsap.killTweensOf([animEl, overlayEl, contentEl].filter(Boolean));
    };
  }, [fromRect, project.title, reducedMotion]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    setClosing(true);
    closingRef.current = true;

    if (reducedMotion) {
      onClose();
      return;
    }

    const animEl = animRef.current;
    const overlayEl = overlayRef.current;
    if (!animEl || !overlayEl) {
      onClose();
      return;
    }

    // Measure now — centering + scroll change the rect after open; stale refs break the exit.
    const toRect = animEl.getBoundingClientRect();
    if (toRect.width < 1 || toRect.height < 1) {
      onClose();
      return;
    }

    introTlRef.current?.kill();
    introTlRef.current = null;
    const contentEl = contentRef.current;
    gsap.killTweensOf([animEl, overlayEl, contentEl].filter(Boolean));

    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    const sx = fromRect.width / toRect.width;
    const sy = fromRect.height / toRect.height;

    const tl = gsap.timeline({ defaults: { ease: "expo.in", overwrite: "auto" } });
    tl.to(overlayEl, { autoAlpha: 0, duration: 0.22 });
    tl.to(
      animEl,
      {
        x: dx,
        y: dy,
        scaleX: sx,
        scaleY: sy,
        duration: 0.55,
      },
      "-=0.1",
    );
    tl.set(animEl, { clearProps: "transform" });
    tl.set(overlayEl, { clearProps: "opacity" });
    tl.eventCallback("onComplete", () => onClose());
  }, [fromRect, onClose, reducedMotion]);

  // Layout: lock/unlock synchronously so scroll restores before paint (avoids jank with pinned sections).
  useLayoutEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    const scrollY = window.scrollY;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscrollBehavior;
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }

      if (e.key === "Tab") {
        const root = rootRef.current;
        if (!root) return;
        const focusables = getFocusable(root);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const ui = (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100]"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 z-0 touch-none bg-black/70 opacity-0"
        onClick={requestClose}
      />

      {/* Full-viewport overflow layer — flex-based scroll is unreliable on iOS; this pattern scrolls. */}
      <div className="absolute inset-0 z-10 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] [touch-action:pan-y]">
        <div className="flex min-h-full flex-col justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-6 sm:pt-6">
          <div ref={animRef} className="mx-auto w-full max-w-2xl shrink-0 pb-6">
          <div
            ref={modalRef}
            className="w-full rounded-2xl border border-white/10 bg-black/80 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-[2px] sm:p-6 md:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-2">
              <div className="text-xs font-semibold tracking-[0.28em] text-foreground/60">
                PROJECT
              </div>
              <div className="text-2xl font-semibold leading-tight text-foreground">
                {project.title}
              </div>
              <div className="text-sm leading-relaxed text-foreground/70">
                {project.summary}
              </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={requestClose}
                className="shrink-0 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold tracking-wide text-foreground hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Close
              </button>
            </div>

            <div ref={contentRef} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="text-sm font-semibold tracking-wide text-foreground/90">
                  Highlights
                </div>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-relaxed text-foreground/70"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-5">
                <div className="text-sm font-semibold tracking-wide text-foreground/90">
                  Stack
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-semibold tracking-widest text-foreground/70"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 text-sm font-semibold tracking-wide text-foreground/90">
                  Links
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {project.links.map((l) => (
                    <a
                      key={l.href + l.label}
                      href={l.href}
                      data-cursor="view"
                      data-cursor-label="View"
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold text-foreground/80 transition-[transform,opacity,background-color,border-color] duration-300 hover:bg-white/5 hover:border-white/20 active:scale-[0.99]"
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="text-sm font-semibold tracking-wide text-foreground/90">
                  Want this outcome?
                </div>
                <div className="mt-2 text-sm leading-relaxed text-foreground/70">
                  Send a short summary of your workflow and constraints (APIs, timelines, edge cases). I’ll reply with
                  a practical plan.
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );

  // Render in a portal to avoid fixed-position issues
  // inside transformed/pinned sections (e.g. ScrollTrigger pin).
  if (typeof document === "undefined") return null;
  return createPortal(ui, document.body);
}

