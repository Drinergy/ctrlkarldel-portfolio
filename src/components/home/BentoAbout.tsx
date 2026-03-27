"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { registerGsapPlugins } from "@/lib/gsap";
import { portfolioContent } from "@/components/content/portfolio-content";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

function BentoTile({
  eyebrow,
  title,
  body,
  className,
}: Readonly<{
  eyebrow: string;
  title: string;
  body: string;
  className?: string;
}>) {
  return (
    <div
      data-bento-tile
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-surface/70 p-7 ${
        className ?? ""
      }`}
    >
      <div
        data-bento-mask
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: "inset(0 0 100% 0 round 24px)",
          background:
            "linear-gradient(135deg, rgba(224,255,0,0.16), rgba(224,255,0,0) 55%), radial-gradient(900px 520px at 20% 20%, rgba(255,255,255,0.06), rgba(255,255,255,0) 62%)",
        }}
      />

      <div className="relative">
        <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55">
          {eyebrow}
        </div>
        <div className="mt-4 font-display text-[34px] leading-[0.86] tracking-tight text-foreground/90">
          {title}
        </div>
        <div className="mt-4 font-mono text-[12px] leading-relaxed tracking-[0.16em] text-foreground/65">
          {body}
        </div>
      </div>
    </div>
  );
}

export default function BentoAbout() {
  const reducedMotion = useReducedMotion();
  const scopeRef = useRef<HTMLElement | null>(null);

  const tiles = useMemo(
    () => [
      {
        eyebrow: "PHILOSOPHY",
        title: "Stability first.",
        body: "I optimize for predictable behavior in production—clear interfaces, safe failure modes, and maintainable code.",
        className: "md:col-span-7",
      },
      {
        eyebrow: "DELIVERY",
        title: "Fast, without shortcuts.",
        body: "I ship quickly with structure: small surface area, intentional abstractions, and clean handoffs.",
        className: "md:col-span-5",
      },
      {
        eyebrow: "CRAFT",
        title: "Clarity in every detail.",
        body: "From UI hierarchy to API design, everything is built to be understood—by users and by teams.",
        className: "md:col-span-5",
      },
      {
        eyebrow: "ABOUT",
        title: "Built for real workflows.",
        body: portfolioContent.about[0] ?? "",
        className: "md:col-span-7",
      },
    ],
    [],
  );

  useGSAP(
    () => {
      registerGsapPlugins();
      if (reducedMotion) return;

      const scope = scopeRef.current;
      if (!scope) return;

      const tilesEl = Array.from(scope.querySelectorAll<HTMLElement>("[data-bento-tile]"));
      const masks = Array.from(scope.querySelectorAll<HTMLElement>("[data-bento-mask]"));

      gsap.set(tilesEl, { y: 26, opacity: 0 });
      gsap.set(masks, { opacity: 0.9 });

      ScrollTrigger.batch(tilesEl, {
        start: "top 80%",
        onEnter: (batch) => {
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
          tl.to(batch, { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 });
          tl.to(
            batch.map((el) => el.querySelector<HTMLElement>("[data-bento-mask]")).filter(Boolean),
            {
              clipPath: "inset(0 0 0% 0 round 24px)",
              duration: 1.05,
              ease: "expo.out",
              stagger: 0.1,
            },
            0.1,
          );
        },
        once: true,
      });
    },
    { scope: scopeRef, dependencies: [reducedMotion] },
  );

  return (
    <section ref={scopeRef} className="relative mt-24 px-6 pb-24">
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex items-end justify-between gap-10">
          <div>
            <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55">
              BENTO_SYSTEM
            </div>
            <div className="mt-3 font-display text-[clamp(42px,6vw,88px)] leading-[0.78] tracking-tight">
              <span className="block">A broken grid.</span>
              <span className="block">A clear story.</span>
            </div>
          </div>
          <div className="hidden md:block max-w-sm font-mono text-[12px] leading-relaxed tracking-[0.18em] text-foreground/55">
            A quick snapshot of how I work: stability, delivery, and engineering clarity. Simple layout. Strong hierarchy.
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-12">
          {tiles.map((t) => (
            <BentoTile
              key={t.title}
              eyebrow={t.eyebrow}
              title={t.title}
              body={t.body}
              className={t.className}
            />
          ))}
        </div>

        <div className="mt-14 h-px w-full bg-white/10" />
      </div>
    </section>
  );
}

