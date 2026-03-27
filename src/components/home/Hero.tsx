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
    <section ref={scopeRef} className="relative overflow-hidden px-6 pt-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-surface/40 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="font-mono text-[11px] tracking-[0.28em] text-foreground/70">
                {portfolioContent.role.toUpperCase()}
              </span>
            </div>

            <h1
              data-hero-head
              className="mt-8 text-[clamp(64px,8.8vw,136px)] leading-[0.78] tracking-tight font-display"
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
              className="mt-6 max-w-xl font-mono text-[12px] leading-relaxed tracking-[0.22em] text-foreground/65"
            >
              <SplitText text={sub} unit="char" />
            </p>

            <div data-hero-meta className="mt-10 flex flex-wrap items-center gap-3">
              <MagneticButton
                href="/projects"
                cursor="view"
                cursorLabel="View"
                className="group rounded-full border border-white/15 bg-white/0 px-6 py-3 font-mono text-[12px] tracking-[0.22em] text-foreground/85 transition-colors hover:bg-white/[0.03]"
              >
                VIEW_WORK
              </MagneticButton>
              <MagneticButton
                href="/resume"
                cursor="view"
                cursorLabel="View"
                className="group rounded-full border border-white/15 bg-white/0 px-6 py-3 font-mono text-[12px] tracking-[0.22em] text-foreground/85 transition-colors hover:bg-white/[0.03]"
              >
                VIEW_RESUME
              </MagneticButton>
              <MagneticButton
                href="/contact"
                cursor="open"
                cursorLabel="Open"
                className="rounded-full border border-white/10 bg-white/0 px-6 py-3 font-mono text-[12px] tracking-[0.22em] text-foreground/80 hover:bg-white/[0.03]"
              >
                START_PROJECT
              </MagneticButton>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              ref={mediaRef}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-surface/60"
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

              <div className="absolute inset-x-0 bottom-7 z-10 px-6 pb-6 sm:bottom-8">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-5 backdrop-blur-[3px]">
                  <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/60">
                    WHAT_I_BUILD
                  </div>
                  <div className="mt-3 text-[22px] leading-tight tracking-tight text-foreground/90 font-display">
                    <span className="block">Laravel APIs.</span>
                    <span className="block">Integrations.</span>
                    <span className="block">Shipping systems.</span>
                  </div>
                  <div className="mt-2 font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/65">
                    Production integration experience across payments and shipping, with safe retries, idempotency, and edge-case handling.
                    <div className="mt-3 space-y-2">
                      <div className="font-mono text-[11px] tracking-[0.22em] text-foreground/60">
                        PAYMENTS: PAYMONGO · STRIPE · SEAMLESSCHEX (CC, ACH) · PAYNOTE
                      </div>
                      <div className="font-mono text-[11px] tracking-[0.22em] text-foreground/60">
                        SHIPMENTS: UPS · USPS · SHIPSTATION · SHIPPO
                      </div>
                    </div>
                    <div className="mt-4 border-t border-white/10 pt-4">
                      <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55">
                        HOW_I_WORK
                      </div>
                      <div className="mt-2 font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/65">
                        AI-assisted development to boost skills and speed. I orchestrate tooling, prompts, and reviews so architecture and quality stay engineer-owned.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between font-mono text-[11px] tracking-[0.22em] sm:text-[12px]">
              <span className="text-foreground/72">SCROLL_TO_EXPLORE</span>
              <span className="text-accent">AVAILABLE_FOR_WORK</span>
            </div>
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />
      </div>
    </section>
  );
}

