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
  const modalRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [closing, setClosing] = useState(false);
  const toRectRef = useRef<DOMRect | null>(null);
  const closingRef = useRef(false);
  useEffect(() => {
    closingRef.current = closing;
  }, [closing]);

  useLayoutEffect(() => {
    if (reducedMotion) {
      closeBtnRef.current?.focus();
      return;
    }

    const modalEl = modalRef.current;
    const overlayEl = overlayRef.current;
    if (!modalEl || !overlayEl) return;

    const toRect = modalEl.getBoundingClientRect();
    toRectRef.current = toRect;

    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    const sx = fromRect.width / toRect.width;
    const sy = fromRect.height / toRect.height;

    gsap.set(overlayEl, { autoAlpha: 0 });
    gsap.set(modalEl, { x: dx, y: dy, scaleX: sx, scaleY: sy });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(overlayEl, { autoAlpha: 1, duration: 0.22 });
      tl.to(
        modalEl,
        {
          x: 0,
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.65,
        },
        "-=0.05",
      );
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
        );
      }
    }, rootRef);

    closeBtnRef.current?.focus();

    return () => ctx.revert();
  }, [fromRect, project.title, reducedMotion]);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    setClosing(true);
    closingRef.current = true;

    if (reducedMotion) {
      onClose();
      return;
    }

    const modalEl = modalRef.current;
    const overlayEl = overlayRef.current;
    const toRect = toRectRef.current;
    if (!modalEl || !overlayEl || !toRect) {
      onClose();
      return;
    }

    const dx = fromRect.left - toRect.left;
    const dy = fromRect.top - toRect.top;
    const sx = fromRect.width / toRect.width;
    const sy = fromRect.height / toRect.height;

    const tl = gsap.timeline({ defaults: { ease: "expo.in" } });
    tl.to(overlayEl, { autoAlpha: 0, duration: 0.22 });
    tl.to(
      modalEl,
      {
        x: dx,
        y: dy,
        scaleX: sx,
        scaleY: sy,
        duration: 0.55,
      },
      "-=0.1",
    );
    tl.set(modalEl, { clearProps: "transform" });
    tl.set(overlayEl, { clearProps: "opacity" });
    tl.eventCallback("onComplete", () => onClose());
  }, [fromRect, onClose, reducedMotion]);

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

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    // Lock scroll without shifting layout (scrollbar compensation).
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [requestClose]);

  const ui = (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/70 opacity-0"
        onClick={requestClose}
      />

      <div className="relative h-full overflow-y-auto overscroll-contain p-3 [-webkit-overflow-scrolling:touch] sm:p-6">
        <div className="mx-auto flex min-h-full w-full max-w-2xl items-start py-3 sm:items-center sm:py-0">
          <div
            ref={modalRef}
            className="w-full max-h-[calc(100svh-1.5rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-black/80 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-[2px] [-webkit-overflow-scrolling:touch] sm:max-h-[calc(100svh-3rem)] sm:p-6 md:p-8"
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
  );

  // Render in a portal to avoid fixed-position issues
  // inside transformed/pinned sections (e.g. ScrollTrigger pin).
  if (typeof document === "undefined") return null;
  return createPortal(ui, document.body);
}

