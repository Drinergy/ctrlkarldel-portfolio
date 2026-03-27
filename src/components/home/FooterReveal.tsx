"use client";

import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "@/components/cursor/MagneticButton";
import { registerGsapPlugins } from "@/lib/gsap";
import { portfolioContent } from "@/components/content/portfolio-content";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import GsapLink from "@/components/gsap/GsapLink";

export default function FooterReveal() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;

      const scope = scopeRef.current;
      const footer = footerRef.current;
      if (!scope || !footer) return;

      const content = scope.querySelector<HTMLElement>("[data-footer-content]");
      if (!content) return;

      gsap.set(content, { y: 32, opacity: 0 });

      ScrollTrigger.create({
        trigger: scope,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.9,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(footer, { y: (1 - p) * 48 });
          gsap.set(content, { y: 32 - p * 32, opacity: p });
        },
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={scopeRef} className="relative px-6 pb-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Spacer so the footer feels “behind” the page */}
        <div className="h-[38vh]" aria-hidden="true" />
      </div>

      <div
        ref={footerRef}
        className="sticky bottom-0 mx-auto w-full max-w-6xl rounded-t-3xl border border-white/10 bg-surface/80 px-6 py-10 backdrop-blur-[6px]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-t-3xl"
          style={{
            background:
              "radial-gradient(900px 520px at 20% 20%, rgba(224,255,0,0.14), rgba(224,255,0,0) 58%), radial-gradient(650px 420px at 85% 80%, rgba(255,255,255,0.06), rgba(255,255,255,0) 62%)",
          }}
        />

        <div data-footer-content className="relative">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55">
                LETS_WORK
              </div>
              <div className="mt-3 font-display text-[clamp(46px,7vw,104px)] leading-[0.78] tracking-tight">
                <span className="block">Let’s ship.</span>
                <span className="block">Clear scope.</span>
                <span className="block">Stable delivery.</span>
              </div>
              <div className="mt-4 max-w-xl font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/65">
                Send a short brief (goals, constraints, APIs, timelines). I’ll reply with a concrete approach and next steps.
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 md:max-w-xl md:items-end">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-end sm:gap-3">
                <MagneticButton
                  href="/contact"
                  cursor="open"
                  cursorLabel="Open"
                  className="w-full rounded-full border border-white/10 bg-accent px-7 py-3 text-center font-mono text-[12px] tracking-[0.22em] text-black/90 sm:w-auto"
                >
                  CONTACT
                </MagneticButton>
                <MagneticButton
                  href="/resume"
                  cursor="view"
                  cursorLabel="View"
                  className="w-full rounded-full border border-white/15 bg-black/20 px-7 py-3 text-center font-mono text-[12px] tracking-[0.22em] text-foreground/85 sm:w-auto"
                >
                  VIEW_RESUME
                </MagneticButton>
                <MagneticButton
                  href="/projects"
                  cursor="view"
                  cursorLabel="View"
                  className="w-full rounded-full border border-white/15 bg-transparent px-7 py-3 text-center font-mono text-[12px] tracking-[0.22em] text-foreground/80 sm:w-auto"
                >
                  VIEW_WORK
                </MagneticButton>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <div className="font-mono text-[11px] tracking-[0.22em] text-foreground/55">
              {portfolioContent.contact.location.toUpperCase()}
            </div>
            <GsapLink
              href={`mailto:${portfolioContent.contact.email}`}
              className="font-mono text-[11px] tracking-[0.22em] text-foreground/70 hover:text-foreground"
            >
              {portfolioContent.contact.email.toUpperCase()}
            </GsapLink>
          </div>
        </div>
      </div>
    </section>
  );
}

