"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

export default function GsapLink({
  href,
  children,
  className,
  cursor = "link",
  cursorLabel,
}: Readonly<{
  href: string;
  children: React.ReactNode;
  className?: string;
  cursor?: "default" | "link" | "view" | "open";
  cursorLabel?: string;
}>) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reducedMotion) return;

      // Underline "draw" effect using a background image layer.
      gsap.set(el, {
        backgroundImage: "linear-gradient(to right, rgba(224,255,0,0.92), rgba(224,255,0,0.92))",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 100%",
        backgroundSize: "0% 1px",
      });

      const onEnter = () => {
        gsap.to(el, {
          y: -1,
          duration: 0.22,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(el, {
          backgroundSize: "100% 1px",
          duration: 0.35,
          ease: "power2.out",
          overwrite: "auto",
        });
      };

      const onLeave = () => {
        gsap.to(el, {
          y: 0,
          duration: 0.35,
          ease: "expo.out",
          overwrite: "auto",
        });
        gsap.to(el, {
          backgroundSize: "0% 1px",
          duration: 0.4,
          ease: "expo.out",
          overwrite: "auto",
        });
      };

      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { dependencies: [reducedMotion] },
  );

  const isExternal = href.startsWith("http") || href.startsWith("mailto:");
  if (isExternal) {
    return (
      <a
        ref={ref}
        href={href}
        data-cursor={cursor}
        data-cursor-label={cursorLabel}
        className={className}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      data-cursor={cursor}
      data-cursor-label={cursorLabel}
      className={className}
    >
      {children}
    </Link>
  );
}

