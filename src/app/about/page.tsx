import { portfolioContent } from "@/components/content/portfolio-content";
import RevealText from "@/components/gsap/RevealText";
import ScrollReveal from "@/components/gsap/ScrollReveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `About — ${portfolioContent.name}`,
  description: "Laravel expertise, API integrations, and practical systems engineering.",
};

export default function AboutPage() {
  return (
    <main className="px-6 pb-24 pt-12 md:pt-14">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-12">
          <ScrollReveal>
            <div className="space-y-5">
              <div className="font-mono text-[12px] font-semibold tracking-[0.28em] text-foreground/60">
                ABOUT
              </div>
              <h1 className="font-display text-[clamp(44px,5.5vw,80px)] font-semibold leading-[0.92] tracking-tight">
                <RevealText
                  text="Laravel-first engineering with real-world API constraints."
                  className="block"
                />
              </h1>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="sticky top-6 space-y-6 rounded-2xl border border-white/10 bg-black/20 p-7 md:p-8">
                <div className="font-mono text-[12px] font-semibold tracking-[0.28em] text-foreground/60">
                  PRINCIPLES
                </div>
                <div className="space-y-4">
                  <ScrollReveal>
                    <div className="text-xl font-semibold leading-snug text-foreground md:text-2xl">
                      Stability over novelty.
                    </div>
                  </ScrollReveal>
                  <ScrollReveal>
                    <div className="text-xl font-semibold leading-snug text-foreground md:text-2xl">
                      Clear interfaces.
                    </div>
                  </ScrollReveal>
                  <ScrollReveal>
                    <div className="text-xl font-semibold leading-snug text-foreground md:text-2xl">
                      Measurable delivery.
                    </div>
                  </ScrollReveal>
                </div>

                <div className="h-px w-full bg-white/10" />

                <ScrollReveal>
                  <div className="text-base leading-relaxed text-foreground/75">
                    {portfolioContent.contact.location}
                    {" · "}
                    {portfolioContent.contact.email}
                  </div>
                </ScrollReveal>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="space-y-6">
                {portfolioContent.about.map((p) => (
                  <ScrollReveal key={p}>
                    <p className="text-lg leading-relaxed text-foreground/80 md:text-xl md:leading-relaxed">
                      {p}
                    </p>
                  </ScrollReveal>
                ))}

                <ScrollReveal>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <div className="text-base font-semibold tracking-wide text-foreground/90 md:text-lg">
                      What you can expect
                    </div>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {[
                        "Clean endpoints and predictable responses",
                        "Integrations that handle retries and edge cases",
                        "Production-minded performance",
                        "Frontend experiences built for real users",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-xl border border-white/10 bg-black/20 p-5"
                        >
                          <div className="text-base leading-relaxed text-foreground/75">
                            {item}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

