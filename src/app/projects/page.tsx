import MagneticButton from "@/components/cursor/MagneticButton";
import ScrollReveal from "@/components/gsap/ScrollReveal";
import { portfolioContent } from "@/components/content/portfolio-content";
import ProjectGallery from "@/components/projects/ProjectGallery";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Projects — ${portfolioContent.name}`,
  description: portfolioContent.projects.map((p) => p.title).slice(0, 3).join(", "),
};

export default function ProjectsPage() {
  return (
    <main className="page-pad-x pb-24 pt-12 md:pt-14">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-14">
          <ScrollReveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="font-mono text-[12px] tracking-[0.28em] text-foreground/65">
                  PROJECTS
                </div>
                <h1 className="mt-5 font-display text-[clamp(48px,6.8vw,96px)] leading-[0.85] tracking-tight">
                  <span className="block">Projects that ship.</span>
                  <span className="block">Systems that hold.</span>
                </h1>
                <div className="mt-6 max-w-2xl font-mono text-[13px] leading-relaxed tracking-[0.16em] text-foreground/70 md:text-[14px]">
                  Laravel builds, API integrations, and production-minded delivery. Click a project to open details.
                </div>
              </div>
              <div className="sm:text-right">
                <div className="font-mono text-[12px] tracking-[0.22em] text-foreground/60 leading-relaxed md:text-[13px]">
                  CURATED_SELECTION · UPDATED_REGULARLY
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-14 space-y-6">
            <ProjectGallery projects={portfolioContent.projects} />
          </div>

          <div className="mt-14">
            <ScrollReveal>
              <MagneticButton
                href="/contact"
                className="w-full rounded-full border border-white/15 bg-black/30 px-8 py-3.5 text-center font-mono text-[13px] tracking-[0.22em] text-foreground/85 sm:w-auto"
              >
                REQUEST_ESTIMATE
              </MagneticButton>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </main>
  );
}

