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
      const animEl = animRef.current;
      const overlayEl = overlayRef.current;
      const contentEl = contentRef.current;
      if (animEl) gsap.set(animEl, { opacity: 1, clearProps: "opacity" });
      if (overlayEl) gsap.set(overlayEl, { autoAlpha: 1, clearProps: "opacity,visibility" });
      if (contentEl) gsap.set(contentEl, { opacity: 1, clearProps: "opacity" });
      closeBtnRef.current?.focus();
      return;
    }

    const animEl = animRef.current;
    const overlayEl = overlayRef.current;
    const contentEl = contentRef.current;
    if (!animEl || !overlayEl) return;

    gsap.killTweensOf([animEl, overlayEl, contentEl].filter(Boolean));

    // Keep prop wiring intact from callers; entrance is intentionally geometry-agnostic
    // to avoid Chrome glitches when source cards are inside transformed/pinned sections.
    void fromRect;
    gsap.set(overlayEl, { autoAlpha: 0 });
    // Never fade the modal wrapper itself; keep it solid to avoid rare Chrome cases
    // where wrapper opacity can get stuck < 1 inside pinned/transformed contexts.
    gsap.set(animEl, { opacity: 1, clearProps: "opacity" });
    if (contentEl) gsap.set(contentEl, { opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    introTlRef.current = tl;
    tl.to(overlayEl, { autoAlpha: 1, duration: 0.2 }, 0);
    if (contentEl) {
      tl.to(contentEl, { opacity: 1, duration: 0.22 }, 0.06);
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

    introTlRef.current?.kill();
    introTlRef.current = null;
    const animEl = animRef.current;
    const overlayEl = overlayRef.current;
    const contentEl = contentRef.current;
    const targets = [animEl, overlayEl, contentEl].filter(Boolean);
    gsap.killTweensOf(targets);

    if (reducedMotion || !animEl || !overlayEl) {
      onClose();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power2.out", overwrite: "auto" } });
    tl.to(contentEl, { opacity: 0, duration: 0.16 }, 0);
    tl.to(animEl, { opacity: 0, duration: 0.22 }, 0);
    tl.to(overlayEl, { autoAlpha: 0, duration: 0.2 }, 0);
    tl.eventCallback("onComplete", () => onClose());
  }, [onClose, reducedMotion]);

  // Layout: lock/unlock synchronously so scroll restores before paint (avoids jank with pinned sections).
  useLayoutEffect(() => {
    const prevPaddingRight = document.body.style.paddingRight;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlOverscrollBehavior = document.documentElement.style.overscrollBehavior;
    const scrollY = window.scrollY;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    // body position:fixed alone prevents background scroll on all browsers.
    // Do NOT set overflow:hidden on body or html — iOS Safari uses those to block ALL child scroll contexts,
    // including the modal's own overflow-y:auto scroll layer.
    document.documentElement.style.overscrollBehavior = "none";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.documentElement.style.overscrollBehavior = prevHtmlOverscrollBehavior;
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

      {/* Scroll layer — plain block child so iOS Safari scrolls reliably. No flex/table centering. */}
      <div
        data-lenis-prevent
        data-lenis-prevent-touch
        className="absolute inset-0 z-10 h-[100svh] overflow-y-scroll overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch] [touch-action:pan-y]"
      >
        <div
          ref={animRef}
          className="mx-auto w-full max-w-2xl px-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] pt-[max(0.75rem,env(safe-area-inset-top,0px))] sm:px-6 sm:pb-6 sm:pt-6 md:py-[8vh]"
        >
          <div
            ref={modalRef}
            className="w-full rounded-2xl border border-white/10 bg-black/80 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-[2px] sm:p-6 md:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-2">
              <div className="text-xs font-semibold tracking-[0.28em] text-foreground/60">
                PROJECT
              </div>
              <div className="text-[22px] font-semibold leading-tight text-foreground sm:text-2xl md:text-[28px]">
                {project.title}
              </div>
              <div className="text-[13px] leading-relaxed text-foreground/70 sm:text-sm md:text-[15px] md:leading-relaxed">
                {project.summary}
              </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                data-cursor="view"
                data-cursor-label="Close"
                onClick={requestClose}
                className="shrink-0 rounded-full border border-white/20 px-5 py-3 text-[13px] font-semibold tracking-wide text-foreground hover:bg-white/5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-3 md:text-base"
              >
                Close
              </button>
            </div>

            <div ref={contentRef} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="text-[13px] font-semibold tracking-wide text-foreground/90 sm:text-sm md:text-[15px]">
                  Highlights
                </div>
                <ul className="mt-4 space-y-3">
                  {project.highlights.map((h) => (
                    <li
                      key={h}
                      className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[13px] leading-relaxed text-foreground/70 sm:text-sm md:text-[15px]"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-5">
                <div className="text-[13px] font-semibold tracking-wide text-foreground/90 sm:text-sm md:text-[15px]">
                  Stack
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[12px] font-semibold tracking-widest text-foreground/70 sm:text-[11px] md:text-[12px]"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-6 text-[13px] font-semibold tracking-wide text-foreground/90 sm:text-sm md:text-[15px]">
                  Links
                </div>
                <div className="mt-3 flex flex-col gap-2">
                  {project.links.map((l) => (
                    <a
                      key={l.href + l.label}
                      href={l.href}
                      data-cursor="view"
                      data-cursor-label="View"
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[13px] font-semibold text-foreground/80 transition-[transform,opacity,background-color,border-color] duration-300 hover:bg-white/5 hover:border-white/20 active:scale-[0.99] sm:text-sm md:text-[15px]"
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
                <div className="text-[13px] font-semibold tracking-wide text-foreground/90 sm:text-sm md:text-[15px]">
                  Want this outcome?
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-foreground/70 sm:text-sm md:text-[15px]">
                  Send a short summary of your workflow and constraints (APIs, timelines, edge cases). I’ll reply with
                  a practical plan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(ui, document.body);
}

