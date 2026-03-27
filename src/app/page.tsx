import { portfolioContent } from "@/components/content/portfolio-content";
import HomeExperience from "@/components/home/HomeExperience";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `${portfolioContent.name} — ${portfolioContent.role}`,
  description: portfolioContent.tagline,
};

export default function Home() {
  return <HomeExperience />;
}
