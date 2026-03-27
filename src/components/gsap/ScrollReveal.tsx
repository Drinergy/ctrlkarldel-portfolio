"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import { registerGsapPlugins } from "@/lib/gsap";

export default function ScrollReveal({
  children,
  className,
  start = "top 85%",
  y = 36,
  duration = 0.75,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
  start?: string;
  y?: number;
  duration?: number;
}>) {
  const reducedMotion = useReducedMotion();
  const elRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    if (reducedMotion) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    registerGsapPlugins();

    let trigger: ScrollTrigger | null = null;
    const ctx = gsap.context(() => {
      gsap.set(el, { opacity: 0, y });

      trigger = ScrollTrigger.create({
        trigger: el,
        start,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration,
            ease: "power3.out",
            overwrite: "auto",
          });
          trigger?.kill();
        },
      });
    }, el);

    return () => {
      trigger?.kill();
      ctx.revert();
    };
  }, [reducedMotion, start, y, duration]);

  return (
    <div ref={elRef} className={className}>
      {children}
    </div>
  );
}

