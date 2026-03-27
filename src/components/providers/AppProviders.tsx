"use client";

import SmoothScrollProvider from "@/components/smooth-scroll/SmoothScrollProvider";

export default function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}

