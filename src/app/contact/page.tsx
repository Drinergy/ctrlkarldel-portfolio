import MagneticButton from "@/components/cursor/MagneticButton";
import RevealText from "@/components/gsap/RevealText";
import ScrollReveal from "@/components/gsap/ScrollReveal";
import { portfolioContent } from "@/components/content/portfolio-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact — ${portfolioContent.name}`,
  description: `Freelance projects and Laravel API integration work for small businesses.`,
};

export default function ContactPage() {
  const email = portfolioContent.contact.email;

  return (
    <main className="min-w-0 px-4 pb-24 pt-12 sm:px-6 md:pt-14">
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-12">
          <ScrollReveal>
            <div className="space-y-5">
              <div className="font-mono text-[12px] font-semibold tracking-[0.28em] text-foreground/60">
                CONTACT
              </div>
              <h1 className="font-display text-[clamp(44px,5.5vw,80px)] font-semibold leading-[0.92] tracking-tight">
                <RevealText
                  text="Let’s ship something that works."
                  className="block"
                />
              </h1>
              <div className="max-w-3xl text-lg leading-relaxed text-foreground/80 md:text-xl md:leading-relaxed">
                Practical Laravel APIs, 3rd-party integrations, and business websites.
                {` `}
                Built with stability and maintainability first.
              </div>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
            <div className="min-w-0 lg:col-span-7">
              <div className="space-y-5 rounded-2xl border border-white/10 bg-black/20 p-7 md:p-8">
                <ScrollReveal>
                  <div className="font-mono text-[12px] font-semibold tracking-[0.22em] text-foreground/75">
                    EMAIL
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="break-all text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
                    {email}
                  </div>
                </ScrollReveal>
                <ScrollReveal>
                  <div className="text-base leading-relaxed text-foreground/75 md:text-lg">
                    If you have an API workflow, integration requirement, or a website that needs to convert,
                    send the details and I’ll reply with next steps.
                  </div>
                </ScrollReveal>
              </div>
            </div>
            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
                <ScrollReveal>
                  <div className="flex flex-col gap-4 sm:gap-5">
                    <MagneticButton
                      href={`mailto:${email}`}
                      className="w-full rounded-full border border-white/20 bg-black/30 px-8 py-4 text-center font-mono text-[13px] tracking-[0.22em] text-foreground/85"
                    >
                      EMAIL_ME
                    </MagneticButton>
                    <MagneticButton
                      href="/projects"
                      className="w-full rounded-full border border-white/10 bg-white/0 px-8 py-4 text-center font-mono text-[13px] tracking-[0.22em] text-foreground/80"
                    >
                      VIEW_PROJECTS
                    </MagneticButton>
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

