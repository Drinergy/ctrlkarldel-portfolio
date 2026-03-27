"use client";

import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MagneticButton from "@/components/cursor/MagneticButton";
import { registerGsapPlugins } from "@/lib/gsap";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

const services = [
  {
    title: "Decision Architecture",
    body: "We map your current technology, define a clear roadmap, and surface risks early.",
  },
  {
    title: "Custom Software Platforms",
    body: "Purpose-built applications designed around how your business actually operates.",
  },
  {
    title: "Systems & Integrations",
    body: "Connect the tools you already use into one coherent, reliable workflow.",
  },
  {
    title: "Workflow Automation",
    body: "Replace repetitive tasks with dependable processes and measurable time savings.",
  },
  {
    title: "AI-Assisted Tools",
    body: "Practical AI features with human oversight—useful, safe, and aligned to operations.",
  },
] as const;

export default function CompanySpotlight() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;
      const scope = scopeRef.current;
      if (!scope) return;

      const items = Array.from(scope.querySelectorAll<HTMLElement>("[data-company-reveal]"));
      gsap.set(items, { y: 22, opacity: 0 });

      ScrollTrigger.create({
        trigger: scope,
        start: "top 80%",
        once: true,
        onEnter: () => {
          gsap.to(items, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.08,
          });
        },
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={scopeRef} className="relative mt-24 px-6 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div
          data-company-reveal
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface/70 p-7 md:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(900px 520px at 20% 20%, rgba(224,255,0,0.16), rgba(224,255,0,0) 58%), radial-gradient(650px 420px at 85% 80%, rgba(255,255,255,0.06), rgba(255,255,255,0) 62%)",
            }}
          />

          <div className="relative grid gap-8 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div
                data-company-reveal
                className="font-mono text-[11px] tracking-[0.28em] text-foreground/55"
              >
                COMPANY
              </div>
              <div
                data-company-reveal
                className="mt-4 font-display text-[clamp(42px,6vw,86px)] leading-[0.82] tracking-tight"
              >
                <span className="block">Solomon GE Systems LLC</span>
                <span className="block text-foreground/75">We build the software your business runs on.</span>
              </div>
              <div
                data-company-reveal
                className="mt-4 max-w-2xl font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/65"
              >
                A company I co-own. We design, build, and support production software—platforms, integrations, and
                operational systems built for reliability.
              </div>
            </div>

            <div className="md:col-span-4 md:flex md:justify-end">
              <div className="flex flex-col gap-3">
                <MagneticButton
                  href="https://sgesys.com"
                  cursor="view"
                  cursorLabel="View"
                  className="rounded-full border border-white/10 bg-accent px-7 py-3 text-center font-mono text-[12px] tracking-[0.22em] text-black/90"
                >
                  VISIT_COMPANY
                </MagneticButton>
                <div className="font-mono text-[11px] tracking-[0.22em] text-foreground/55">
                  sgesys.com
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-12">
            {services.map((s, idx) => {
              const span =
                idx === 0 ? "md:col-span-12" : idx < 3 ? "md:col-span-6" : "md:col-span-6";
              return (
                <div
                  key={s.title}
                  data-company-reveal
                  className={`relative overflow-hidden rounded-2xl border border-white/10 bg-black/25 p-6 ${span}`}
                >
                  <div className="font-display text-[22px] leading-tight tracking-tight text-foreground/90">
                    {s.title}
                  </div>
                  <div className="mt-2 font-mono text-[12px] leading-relaxed tracking-[0.16em] text-foreground/65">
                    {s.body}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />
      </div>
    </section>
  );
}

