"use client";

import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

let pluginsRegistered = false;

/**
 * Registers GSAP plugins exactly once on the client.
 *
 * Keeping plugin registration centralized avoids repeated `registerPlugin` calls
 * across many animation components.
 */
export function registerGsapPlugins(): void {
  if (pluginsRegistered) return;
  if (typeof window === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);
  pluginsRegistered = true;
}

/**
 * Ensures `registerGsapPlugins()` is called from a client component.
 * Useful when you want to guarantee plugin registration before creating tweens.
 */
export function useGsapPluginsReady(): void {
  registerGsapPlugins();
}

