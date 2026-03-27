import type { Metadata } from "next";
import ResumePage from "@/components/resume/ResumePage";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume — view and download as PDF.",
};

export default async function ResumeRoute({
  searchParams,
}: Readonly<{
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const sp = searchParams ? await searchParams : undefined;
  const autoPrint = sp?.print === "1";
  return <ResumePage autoPrint={autoPrint} />;
}

