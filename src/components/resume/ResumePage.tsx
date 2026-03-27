import ResumeActions from "@/components/resume/ResumeActions";

type ExperienceItem = Readonly<{
  company: string;
  role: string;
  dates: string;
  bullets: ReadonlyArray<string>;
}>;

function SectionTitle({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="font-mono text-[11px] tracking-[0.28em] text-foreground/55 print:text-black print:opacity-90">
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px w-full bg-white/10 print:bg-neutral-300" aria-hidden="true" />
  );
}

export default function ResumePage() {
  const header = {
    name: "ctrlkarldel",
    title: "Software Engineer",
    email: "karl.sgesys@gmail.com",
    location: "Remote / Cabanatuan City, Nueva Ecija, Philippines",
  } as const;

  const summary =
    "Backend-focused software engineer specializing in Laravel API design and 3rd-party integrations. I build predictable, production-safe workflows (webhooks, retries, idempotency) and maintain systems teams can evolve confidently. I use AI-assisted development to sharpen delivery and skill growth, and I work as an AI orchestrator—owning architecture and review while integrating models and tooling responsibly.";

  const experience: ReadonlyArray<ExperienceItem> = [
    {
      company: "MJSI (Marcon John Solutions Inc)",
      role: "Lead Software Engineer",
      dates: "2024 Sept – Present",
      bullets: [
        "Own API design and maintenance across Laravel services with stable contracts and clear error handling.",
        "Lead technical decisions for integrations, security hardening, and performance improvements across core workflows.",
        "Drive reliability practices: safe retries, idempotent processing, edge-case handling, and production-minded debugging.",
        "Write and maintain documentation/playbooks that reduce onboarding time and keep delivery consistent.",
      ],
    },
    {
      company: "JBSI (Johnsons Berkshire Solutions Inc)",
      role: "Jr Software Engineer",
      dates: "2023 Jan – 2024 Sept",
      bullets: [
        "Built and maintained REST APIs in Laravel (authentication, CRUD, filtering/pagination) used by production workflows.",
        "Integrated 3rd-party APIs with webhooks, retries, and idempotent patterns to prevent duplicate processing.",
        "Payment integrations: Stripe, SeamlessChex (credit card, ACH), and Paynote.",
        "Shipment integrations: UPS, USPS, ShipStation, and Shippo.",
        "Maintained legacy CodeIgniter modules and contributed to Laravel backend + light frontend work.",
        "Improved database performance through query tuning and index-minded schema decisions.",
      ],
    },
    {
      company: "Solomon GE Systems LLC",
      role: "Co-owner",
      dates: "2026 Feb – Present",
      bullets: [
        "Contribute to delivery across engineering, integrations, and production support for client-facing systems.",
      ],
    },
  ];

  const projects = [
    "Dental Training Center Enrollment System — enrollment UX + Laravel system delivery",
    "Wedding RSVP — Laravel-based RSVP flow with production UX and email workflows",
    "Wedding Gallery — Next.js static gallery UI",
    "Solomon GE Systems LLC — UI showcase for structured service narrative and responsive design",
  ] as const;

  const skills = [
    "Laravel (API design, auth, validation)",
    "3rd-party integrations (webhooks, retries, idempotency)",
    "Payments: Stripe, SeamlessChex (CC/ACH), Paynote",
    "Shipping: UPS, USPS, ShipStation, Shippo",
    "Database performance (query tuning, indexing mindset)",
    "Security & reliability (error handling, safe failure modes)",
  ] as const;

  return (
    <main className="resume-print page-pad-x min-w-0 pb-20 pt-8 sm:pb-24 sm:pt-10 print:px-0 print:pb-0 print:pt-0">
      <div className="mx-auto w-full min-w-0 max-w-5xl print:max-w-none">
        <div className="rounded-3xl bg-white/[0.02] p-4 sm:p-6 md:p-10 print:rounded-none print:bg-white print:p-0 print:text-black print:shadow-none">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="font-display text-[clamp(44px,6.4vw,84px)] leading-[0.85] tracking-tight print:text-black">
                {header.name}
              </div>
              <div className="mt-2 font-mono text-[12px] tracking-[0.22em] text-foreground/70 print:text-black">
                {header.title.toUpperCase()}
              </div>

              <div className="mt-5 space-y-1 font-mono text-[12px] tracking-[0.12em] text-foreground/70 print:text-black">
                <div>{header.email}</div>
                <div>{header.location}</div>
              </div>
            </div>

            <ResumeActions variant="downloadOnly" />
          </div>

          <div className="mt-8">
            <Divider />
          </div>

          <div className="mt-8 grid gap-10 md:grid-cols-12 print:grid-cols-1 print:gap-6">
            <div className="md:col-span-7">
              <SectionTitle>SUMMARY</SectionTitle>
              <div className="mt-3 font-mono text-[12px] leading-relaxed tracking-[0.12em] text-foreground/70 print:text-[11px] print:leading-[1.45] print:tracking-[0.04em] print:text-black">
                {summary}
              </div>

              <div className="mt-8">
                <SectionTitle>EXPERIENCE</SectionTitle>
                <div className="mt-5 space-y-6 print:space-y-4">
                  {experience.map((item) => (
                    <div
                      key={item.company}
                      className="break-inside-avoid rounded-2xl border border-white/10 bg-black/20 p-6 print:break-inside-auto print:border-neutral-300 print:bg-white print:p-4 print:shadow-none"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                        <div className="font-display text-[22px] leading-tight tracking-tight text-foreground/90 print:text-black">
                          {item.company}
                        </div>
                        <div className="font-mono text-[11px] tracking-[0.22em] text-foreground/55 print:text-black">
                          {item.dates.toUpperCase()}
                        </div>
                      </div>
                      <div className="mt-2 font-mono text-[12px] tracking-[0.16em] text-foreground/70 print:text-[11px] print:tracking-[0.05em] print:text-black">
                        {item.role}
                      </div>
                      <ul className="mt-3 space-y-2 print:space-y-1.5">
                        {item.bullets.map((b) => (
                          <li
                            key={b}
                            className="font-mono text-[12px] leading-relaxed tracking-[0.12em] text-foreground/70 print:text-[11px] print:leading-[1.4] print:tracking-[0.04em] print:text-black"
                          >
                            - {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <SectionTitle>SKILLS</SectionTitle>
              <div className="mt-4 break-inside-avoid rounded-2xl border border-white/10 bg-black/20 p-6 print:break-inside-auto print:border-neutral-300 print:bg-white print:p-4 print:shadow-none">
                <ul className="space-y-2 print:space-y-1.5">
                  {skills.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[12px] leading-relaxed tracking-[0.12em] text-foreground/70 print:text-[11px] print:leading-[1.4] print:tracking-[0.04em] print:text-black"
                    >
                      - {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <SectionTitle>SELECTED PROJECTS</SectionTitle>
                <div className="mt-4 break-inside-avoid rounded-2xl border border-white/10 bg-black/20 p-6 print:break-inside-auto print:border-neutral-300 print:bg-white print:p-4 print:shadow-none">
                  <ul className="space-y-2 print:space-y-1.5">
                    {projects.map((p) => (
                      <li
                        key={p}
                        className="font-mono text-[12px] leading-relaxed tracking-[0.12em] text-foreground/70 print:text-[11px] print:leading-[1.4] print:tracking-[0.04em] print:text-black"
                      >
                        - {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 print:mt-8">
            <Divider />
          </div>
        </div>
      </div>
    </main>
  );
}

