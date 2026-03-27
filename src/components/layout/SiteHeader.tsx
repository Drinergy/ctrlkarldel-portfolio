"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import MagneticButton from "@/components/cursor/MagneticButton";
import { portfolioContent } from "@/components/content/portfolio-content";
import GsapLink from "@/components/gsap/GsapLink";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const activeHref = useMemo(() => pathname ?? "/", [pathname]);

  useEffect(() => {
    // Defer to avoid "setState in effect" lint warnings.
    const t = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(t);
  }, [activeHref]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="relative z-20 w-full">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <GsapLink
          href="/"
          className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-foreground/80 hover:text-foreground"
        >
          {portfolioContent.name.toUpperCase()}
        </GsapLink>

        <div className="flex items-center gap-4">
          <MagneticButton
            cursor="view"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold tracking-wide text-foreground"
            onClick={() => setOpen(true)}
            disabled={open}
          >
            Menu
          </MagneticButton>
        </div>
      </div>

      {open ? (
        <div
          aria-hidden={false}
          className="fixed inset-0 z-40"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-black/80 px-6 py-8"
          >
            <div className="mb-8 flex items-start justify-between">
              <div className="text-sm font-semibold tracking-wide text-foreground">
                Navigate
              </div>
              <MagneticButton
                cursor="view"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold tracking-wide text-foreground"
                onClick={() => setOpen(false)}
              >
                Close
              </MagneticButton>
            </div>

            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <MagneticButton
                    key={item.href}
                    href={item.href}
                    cursor="link"
                    className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-4 text-left transition-transform"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-sm font-semibold tracking-wide text-foreground">
                      {item.label}
                    </span>
                    <span
                      className={`text-xs tracking-widest ${
                        isActive ? "opacity-100" : "opacity-50"
                      }`}
                    >
                      {isActive ? "ACTIVE" : " "}
                    </span>
                  </MagneticButton>
                );
              })}
            </nav>

            <div className="mt-auto pt-10 text-xs leading-relaxed text-foreground/70">
              Laravel APIs, integrations, and production-minded delivery.
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

