"use client";

import Preloader from "@/components/home/Preloader";
import Hero from "@/components/home/Hero";
import HorizontalProjects from "@/components/home/HorizontalProjects";
import BentoAbout from "@/components/home/BentoAbout";
import CompanySpotlight from "@/components/home/CompanySpotlight";
import FooterReveal from "@/components/home/FooterReveal";
import { portfolioContent } from "@/components/content/portfolio-content";

export default function HomeExperience() {
  return (
    <Preloader>
      <main className="relative">
        <Hero />
        <HorizontalProjects projects={portfolioContent.projects} />
        <BentoAbout />
        <CompanySpotlight />
        <FooterReveal />
      </main>
    </Preloader>
  );
}

