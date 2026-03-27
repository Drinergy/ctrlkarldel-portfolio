"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import { registerGsapPlugins } from "@/lib/gsap";

export default function RevealText({
  text,
  className,
}: Readonly<{
  text: string;
  className?: string;
}>) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLSpanElement | null>(null);

  const words = useMemo(() => {
    const normalized = text.trim().replace(/\s+/g, " ");
    if (!normalized) return [];
    return normalized.split(" ");
  }, [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (reducedMotion) return;

    registerGsapPlugins();

    const wordEls = Array.from(
      container.querySelectorAll<HTMLElement>("[data-reveal-word]"),
    );
    if (wordEls.length === 0) return;

    let trigger: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      gsap.set(wordEls, { y: 38, opacity: 0 });

      const groupLines = () => {
        const items = wordEls
          .map((el) => ({ el, top: el.offsetTop, left: el.offsetLeft }))
          .sort((a, b) => a.top - b.top);

        const threshold = 3; // px tolerance for line clustering
        const lines: HTMLElement[][] = [];
        let currentTop: number | null = null;

        for (const item of items) {
          if (currentTop === null || Math.abs(item.top - currentTop) > threshold) {
            currentTop = item.top;
            lines.push([item.el]);
          } else {
            lines[lines.length - 1].push(item.el);
          }
        }

        return lines.map((lineWords) =>
          lineWords.sort((a, b) => a.offsetLeft - b.offsetLeft),
        );
      };

      trigger = ScrollTrigger.create({
        trigger: container,
        start: "top 90%",
        once: true,
        onEnter: () => {
          const lines = groupLines();
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          for (const lineWords of lines) {
            tl.to(lineWords, {
              y: 0,
              opacity: 1,
              duration: 0.7,
              stagger: 0.03,
              overwrite: "auto",
            });
          }
        },
      });
    }, container);

    return () => {
      trigger?.kill();
      ctx.revert();
    };
  }, [reducedMotion, words]);

  if (reducedMotion) {
    return (
      <span ref={containerRef} className={className}>
        {text}
      </span>
    );
  }

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          data-reveal-word
          className="inline-block mr-[0.28em] last:mr-0 will-change-transform"
        >
          {word}
        </span>
      ))}
    </span>
  );
}

