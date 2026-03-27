"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "@/components/cursor/MagneticButton";
import { registerGsapPlugins } from "@/lib/gsap";
import { SplitText } from "@/lib/splitText";
import { portfolioContent } from "@/components/content/portfolio-content";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const flareRef = useRef<HTMLDivElement | null>(null);

  const sub = useMemo(
    () =>
      "I build Laravel APIs, webhooks, and integration workflows. AI-assisted development accelerates my craft. I orchestrate models and tools with full ownership of design, review, and shipping.",
    [],
  );

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;

      const scope = scopeRef.current;
      const media = mediaRef.current;
      const flare = flareRef.current;
      if (!scope || !media || !flare) return;

      const headlineChars = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-hero-head] [data-split]"),
      );
      const subChars = Array.from(
        scope.querySelectorAll<HTMLElement>("[data-hero-sub] [data-split]"),
      );
      const meta = Array.from(scope.querySelectorAll<HTMLElement>("[data-hero-meta]"));

      gsap.set([headlineChars, subChars], { y: 42, opacity: 0, rotateZ: 0.001 });
      gsap.set(meta, { y: 14, opacity: 0 });
      gsap.set(media, { scale: 1.12 });
      gsap.set(flare, { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(headlineChars, { y: 0, opacity: 1, duration: 0.95, stagger: 0.012 }, 0);
      tl.to(subChars, { y: 0, opacity: 1, duration: 0.7, stagger: 0.004 }, 0.35);
      tl.to(meta, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 }, 0.6);
      tl.to(flare, { opacity: 1, scale: 1, duration: 0.9 }, 0.55);

      ScrollTrigger.create({
        trigger: scope,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(media, { scale: 1.12 - p * 0.08 });
          gsap.set(flare, { x: p * 22, y: -p * 18, opacity: 1 - p * 0.35 });
        },
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={scopeRef}
      className="page-pad-x relative overflow-hidden pt-8 pb-10 sm:pt-10 sm:pb-12"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="grid min-w-0 gap-12 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-surface/40 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-[0.28em] text-foreground/70">
                {portfolioContent.role.toUpperCase()}
              </span>
            </div>

            <h1
              data-hero-head
              className="mt-6 break-words text-[clamp(52px,14vw,136px)] leading-[0.8] tracking-tight font-display sm:mt-8 sm:text-[clamp(56px,9vw,136px)]"
            >
              <span className="block">{portfolioContent.name}</span>
              <span
                className="block text-foreground/80"
                aria-label="Production grade APIs and integrations."
              >
                <span className="block leading-[0.78]">
                  <SplitText text="PRODUCTION -" unit="word" />
                </span>
                <span className="block leading-[0.78]">
                  <SplitText text="GRADE APIS &" unit="word" />
                </span>
                <span className="block leading-[0.78]">
                  <SplitText text="INTEGRATIONS." unit="word" />
                </span>
              </span>
            </h1>

            <p
              data-hero-sub
              className="mt-5 max-w-xl font-mono text-[12px] leading-relaxed tracking-[0.12em] text-foreground/65 sm:mt-6 sm:tracking-[0.18em] md:tracking-[0.22em]"
            >
              <SplitText text={sub} unit="word" />
            </p>

            <div
              data-hero-meta
              className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <MagneticButton
                href="/projects"
                cursor="view"
                cursorLabel="View"
                className="group w-full justify-center rounded-full border border-white/15 bg-white/0 px-6 py-3 text-center font-mono text-[12px] tracking-[0.18em] text-foreground/85 transition-colors hover:bg-white/[0.03] sm:w-auto sm:tracking-[0.22em]"
              >
                VIEW_WORK
              </MagneticButton>
              <MagneticButton
                href="/resume"
                cursor="view"
                cursorLabel="View"
                className="group w-full justify-center rounded-full border border-white/15 bg-white/0 px-6 py-3 text-center font-mono text-[12px] tracking-[0.18em] text-foreground/85 transition-colors hover:bg-white/[0.03] sm:w-auto sm:tracking-[0.22em]"
              >
                VIEW_RESUME
              </MagneticButton>
              <MagneticButton
                href="/contact"
                cursor="open"
                cursorLabel="Open"
                className="w-full justify-center rounded-full border border-white/10 bg-white/0 px-6 py-3 text-center font-mono text-[12px] tracking-[0.18em] text-foreground/80 hover:bg-white/[0.03] sm:w-auto sm:tracking-[0.22em]"
              >
                START_PROJECT
              </MagneticButton>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div
              ref={mediaRef}
              className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-surface/60 portrait:aspect-[4/5] portrait:max-h-[min(84svh,640px)] landscape:max-h-[min(85svh,640px)] lg:aspect-[4/5] lg:max-h-none"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-70"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "72px 72px, 72px 72px",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(900px 520px at 30% 25%, rgba(224,255,0,0.22), rgba(224,255,0,0.0) 55%), radial-gradient(650px 420px at 80% 70%, rgba(255,255,255,0.10), rgba(255,255,255,0.0) 58%)",
                }}
              />

              <div
                ref={flareRef}
                aria-hidden="true"
                className="absolute -left-10 -top-10 h-56 w-56 rounded-full opacity-0"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(224,255,0,0.75), rgba(224,255,0,0.0) 70%)",
                  filter: "blur(1px)",
                }}
              />

              <div className="absolute inset-3 z-10 overflow-hidden sm:inset-5 md:inset-6">
                <div className="h-full min-h-0 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain rounded-2xl border border-white/10 bg-black/40 p-3 backdrop-blur-[3px] [-webkit-overflow-scrolling:touch] sm:p-5">
                  <div className="font-mono text-[10px] tracking-[0.24em] text-foreground/60 sm:text-[11px] sm:tracking-[0.28em]">
                    WHAT_I_BUILD
                  </div>
                  <div className="mt-2 text-[clamp(18px,5vw,22px)] leading-tight tracking-tight text-foreground/90 font-display sm:mt-3 sm:text-[22px]">
                    <span className="block">Laravel APIs.</span>
                    <span className="block">Integrations.</span>
                    <span className="block">Shipping systems.</span>
                  </div>
                  <div className="mt-2 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-foreground/65 sm:text-[12px] sm:tracking-[0.18em]">
                    Production integration experience across payments and shipping, with safe retries, idempotency, and edge-case handling.
                    <div className="mt-3 space-y-2">
                      <div className="break-words font-mono text-[9px] tracking-[0.14em] text-foreground/60 sm:text-[11px] sm:tracking-[0.2em]">
                        PAYMENTS: PAYMONGO · STRIPE · SEAMLESSCHEX (CC, ACH) · PAYNOTE
                      </div>
                      <div className="break-words font-mono text-[9px] tracking-[0.14em] text-foreground/60 sm:text-[11px] sm:tracking-[0.2em]">
                        SHIPMENTS: UPS · USPS · SHIPSTATION · SHIPPO
                      </div>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="font-mono text-[10px] tracking-[0.24em] text-foreground/55 sm:text-[11px] sm:tracking-[0.28em]">
                        HOW_I_WORK
                      </div>
                      <div className="mt-2 font-mono text-[11px] leading-relaxed tracking-[0.14em] text-foreground/65 sm:text-[12px] sm:tracking-[0.18em]">
                        AI-assisted development to boost skills and speed. I orchestrate tooling, prompts, and reviews so architecture and quality stay engineer-owned.
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 font-mono text-[8px] leading-none tracking-[0.08em] text-foreground/72 sm:pt-4 sm:text-[10px] sm:tracking-[0.16em] md:text-[11px] md:tracking-[0.2em]">
                      <span className="min-w-0 whitespace-nowrap">
                        SCROLL_TO_EXPLORE
                      </span>
                      <span className="shrink-0 whitespace-nowrap text-right text-accent">
                        AVAILABLE_FOR_WORK
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />
      </div>
    </section>
  );
}

