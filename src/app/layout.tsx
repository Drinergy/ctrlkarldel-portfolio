import type { Metadata } from "next";
import { Bebas_Neue, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import RouteTransition from "@/components/layout/RouteTransition";
import NoiseOverlay from "@/components/noise/NoiseOverlay";
import Cursor from "@/components/cursor/Cursor";
import SiteHeader from "@/components/layout/SiteHeader";
import { portfolioContent } from "@/components/content/portfolio-content";
import AppProviders from "@/components/providers/AppProviders";

const display = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: `${portfolioContent.name} — ${portfolioContent.role}`,
  description: portfolioContent.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col relative z-10">
        <AppProviders>
          <NoiseOverlay />
          <Cursor />
          <SiteHeader />
          <RouteTransition>{children}</RouteTransition>
        </AppProviders>
      </body>
    </html>
  );
}
