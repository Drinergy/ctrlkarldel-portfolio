"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/components/gsap/useReducedMotion";
import type { PortfolioProject } from "@/components/content/portfolio-content";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectModal from "@/components/projects/ProjectModal";
import { registerGsapPlugins } from "@/lib/gsap";

type RectLike = Readonly<{
  left: number;
  top: number;
  width: number;
  height: number;
}>;

export default function ProjectGallery({
  projects,
}: Readonly<{
  projects: ReadonlyArray<PortfolioProject>;
}>) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeProject, setActiveProject] = useState<PortfolioProject | null>(null);
  const [fromRect, setFromRect] = useState<RectLike | null>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsapPlugins();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (reducedMotion) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>("[data-project-item]"));
    if (items.length === 0) return;

    gsap.set(items, { opacity: 0, y: 26 });

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: "power3.out",
          stagger: 0.08,
        });
      },
    });

    return () => trigger.kill();
  }, [reducedMotion, projects]);

  return (
    <>
      <div ref={containerRef} className="space-y-6">
        {projects.map((project) => (
          <div key={project.title} data-project-item>
            <ProjectCard
              project={project}
              onOpen={(p, rect) => {
                lastFocusRef.current = document.activeElement as HTMLElement | null;
                setActiveProject(p);
                setFromRect(rect);
              }}
            />
          </div>
        ))}
      </div>

      {activeProject && fromRect ? (
        <ProjectModal
          project={activeProject}
          fromRect={fromRect}
          onClose={() => {
            setActiveProject(null);
            setFromRect(null);
            lastFocusRef.current?.focus?.();
          }}
        />
      ) : null}
    </>
  );
}

