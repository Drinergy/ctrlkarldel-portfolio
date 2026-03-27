import type { Metadata } from "next";
import ResumePage from "@/components/resume/ResumePage";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume — view and download as PDF.",
};

/** Static export: no searchParams on server — print=1 is handled in `ResumeActions` (client). */
export default function ResumeRoute() {
  return <ResumePage />;
}

