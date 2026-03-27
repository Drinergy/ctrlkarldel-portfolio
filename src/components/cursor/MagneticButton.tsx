"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import { useMagnetic } from "@/components/cursor/useMagnetic";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  cursor?: "default" | "link" | "view" | "open";
  cursorLabel?: string;
};

type AsButtonProps = BaseProps & {
  href?: undefined;
  type?: "button" | "submit" | "reset";
};

type AsLinkProps = BaseProps & {
  href: string;
};

export type MagneticButtonProps = AsButtonProps | AsLinkProps;

export default function MagneticButton(props: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const { cursor, cursorLabel } = props;
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const magnetic = useMagnetic<HTMLElement>({ maxOffset: 12, returnDuration: 0.7 });
  const hoverTlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = ("href" in props ? anchorRef.current : buttonRef.current) as
      | HTMLElement
      | null;
    if (!el) return;
    // Keep magnetic's ref in sync with the real element type.
    magnetic.ref.current = el;

    if (reducedMotion) return;
    // Underline draw + lift (GSAP-powered) for all interactive buttons/links.
    gsap.set(el, {
      backgroundImage:
        "linear-gradient(to right, rgba(224,255,0,0.92), rgba(224,255,0,0.92))",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "0 100%",
      backgroundSize: "0% 1px",
    });
  }, [magnetic.ref, props]);

  const hoverEnter = () => {
    const el = magnetic.ref.current;
    if (!el) return;
    if (reducedMotion || props.disabled) return;
    hoverTlRef.current?.kill();
    hoverTlRef.current = gsap.timeline({ defaults: { ease: "power2.out" } });
    hoverTlRef.current.to(el, { y: -1, duration: 0.22 }, 0);
    hoverTlRef.current.to(el, { backgroundSize: "100% 1px", duration: 0.35 }, 0);
  };

  const hoverLeave = () => {
    const el = magnetic.ref.current;
    if (!el) return;
    if (reducedMotion || props.disabled) return;
    hoverTlRef.current?.kill();
    hoverTlRef.current = gsap.timeline({ defaults: { ease: "expo.out" } });
    hoverTlRef.current.to(el, { y: 0, duration: 0.5 }, 0);
    hoverTlRef.current.to(el, { backgroundSize: "0% 1px", duration: 0.55 }, 0);
  };

  if ("href" in props && typeof props.href === "string") {
    return (
      <Link
        href={props.href}
        ref={anchorRef}
        data-cursor={cursor}
        data-cursor-label={cursorLabel}
        className={props.className}
        aria-disabled={props.disabled ? true : undefined}
        tabIndex={props.disabled ? -1 : undefined}
        onPointerEnter={hoverEnter}
        onPointerMove={(e) => {
          if (reducedMotion || props.disabled) return;
          magnetic.onPointerMove(e);
        }}
        onPointerLeave={() => {
          if (reducedMotion || props.disabled) return;
          magnetic.onPointerLeave();
          hoverLeave();
        }}
        onPointerDown={() => {
          if (reducedMotion || props.disabled) return;
          magnetic.onPointerDown();
        }}
        onPointerUp={() => {
          if (reducedMotion || props.disabled) return;
          magnetic.onPointerUp();
        }}
        onPointerCancel={() => {
          if (reducedMotion || props.disabled) return;
          magnetic.onPointerUp();
        }}
        onClick={(e) => {
          if (props.disabled) {
            e.preventDefault();
            return;
          }
          props.onClick?.();
        }}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      ref={buttonRef}
      data-cursor={cursor}
      data-cursor-label={cursorLabel}
      className={props.className}
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.disabled ? undefined : props.onClick}
      aria-disabled={props.disabled ? true : undefined}
      onPointerEnter={hoverEnter}
      onPointerMove={(e) => {
        if (reducedMotion || props.disabled) return;
        magnetic.onPointerMove(e);
      }}
      onPointerLeave={() => {
        if (reducedMotion || props.disabled) return;
        magnetic.onPointerLeave();
        hoverLeave();
      }}
      onPointerDown={() => {
        if (reducedMotion || props.disabled) return;
        magnetic.onPointerDown();
      }}
      onPointerUp={() => {
        if (reducedMotion || props.disabled) return;
        magnetic.onPointerUp();
      }}
      onPointerCancel={() => {
        if (reducedMotion || props.disabled) return;
        magnetic.onPointerUp();
      }}
    >
      {props.children}
    </button>
  );
}

