"use client";

import { useEffect } from "react";
import MagneticButton from "@/components/cursor/MagneticButton";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";

export default function ResumeActions({
  autoPrint,
  variant = "default",
}: Readonly<{
  autoPrint?: boolean;
  variant?: "default" | "downloadOnly";
}>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!autoPrint) return;
    // Let layout settle before invoking print dialog.
    const t = window.setTimeout(() => window.print(), reducedMotion ? 50 : 250);
    return () => window.clearTimeout(t);
  }, [autoPrint, reducedMotion]);

  return (
    <div className="flex flex-wrap gap-3" data-no-print>
      {variant !== "downloadOnly" ? (
        <MagneticButton
          href="/resume"
          cursor="view"
          cursorLabel="View"
          className="rounded-full border border-white/15 bg-white/0 px-6 py-3 font-mono text-[12px] tracking-[0.22em] text-foreground/85 hover:bg-white/[0.03]"
        >
          VIEW
        </MagneticButton>
      ) : null}
      <MagneticButton
        cursor="open"
        cursorLabel="Download"
        className="rounded-full border border-white/10 bg-accent px-6 py-3 font-mono text-[12px] tracking-[0.22em] text-black/90"
        onClick={() => window.print()}
      >
        DOWNLOAD_PDF
      </MagneticButton>
    </div>
  );
}

