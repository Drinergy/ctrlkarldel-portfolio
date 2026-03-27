export type PortfolioProject = Readonly<{
  title: string;
  summary: string;
  highlights: string[];
  stack: string[];
  links: ReadonlyArray<{
    label: string;
    href: string;
  }>;
}>;

export type PortfolioContent = Readonly<{
  name: string;
  role: string;
  tagline: string;
  about: ReadonlyArray<string>;
  skills: ReadonlyArray<string>;
  projects: ReadonlyArray<PortfolioProject>;
  contact: Readonly<{
    email: string;
    location: string;
  }>;
}>;

/**
 * Replace placeholder values with your real name and projects when ready.
 * Keep the structure stable so the UI components can stay type-safe.
 */
export const portfolioContent: PortfolioContent = {
  name: "ctrlkarldel",
  role: "Software Engineer",
  tagline:
    "Laravel systems and API integrations—delivered with AI-assisted workflows I orchestrate end-to-end.",
  about: [
    "I specialize in Laravel development, clean APIs, reliable integrations, and production-ready solutions. I use AI-assisted development to sharpen velocity and craft—and I work as an AI orchestrator: shaping prompts, reviewing outputs, and integrating tools while keeping ownership of architecture, security, and production behavior.",
    "My focus is practical engineering: fewer surprises, clearer data flows, and maintainable code your team can evolve.",
    "Whether it’s a new website or a complex API workflow, I prioritize speed, stability, and measurable outcomes.",
    "Alongside my full-time role, I’m a co-owner at Solomon GE Systems LLC—delivering client software, integrations, and production support.",
  ],
  skills: [
    "Laravel API Development",
    "REST Integrations & Webhooks",
    "3rd-party API Workflows",
    "AI-Assisted Development & Orchestration",
    "Authentication & Authorization",
    "Database Design & Performance",
    "Frontend Engineering",
  ],
  projects: [
    {
      title: "Dental Training Center Enrollment System",
      summary:
        "A production enrollment experience for a training center—designed to help students enroll smoothly and reduce admin friction.",
      highlights: [
        "Enrollment-first UX focused on conversion and clarity",
        "Reliable data flow for real-world operational use",
        "Built to stay fast and stable under marketing traffic",
      ],
      stack: ["Laravel", "Payments", "Integrations", "Production UX"],
      links: [
        {
          label: "Demo Site",
          href: "https://dmfdentaltrainingcenter.onrender.com",
        },
      ],
    },
    {
      title: "Wedding Gallery",
      summary:
        "A clean, modern gallery experience built for storytelling—fast, responsive, and designed to feel premium.",
      highlights: [
        "Performance-first image experience",
        "Responsive layout tuned for mobile viewing",
        "Minimal UI with strong typography and spacing",
      ],
      stack: ["Frontend", "Responsive UI", "Performance", "Static Hosting"],
      links: [
        {
          label: "Live Site",
          href: "https://ae-wedding-gallery.netlify.app",
        },
      ],
    },
    {
      title: "Wedding RSVP",
      summary:
        "An RSVP experience built for clarity and completion—fast, responsive, and designed to feel premium.",
      highlights: [
        "RSVP-first UX optimized for completion rate",
        "Mobile-first flow for guests",
        "Minimal UI with strong typography and spacing",
      ],
      stack: ["Laravel", "Production UX", "Responsive UI"],
      links: [
        {
          label: "Live Site",
          href: "https://ae-wedding.online",
        },
      ],
    },
    {
      title: "Solomon GE Systems LLC",
      summary:
        "A standalone company website built to showcase UI clarity, typography, and a structured service narrative.",
      highlights: [
        "Clear layout system with strong hierarchy and spacing",
        "Service cards and content blocks designed for scannability",
        "Responsive polish and interaction details across breakpoints",
      ],
      stack: ["UI Showcase", "Typography", "Responsive UI", "Interaction"],
      links: [
        {
          label: "View Site",
          href: "https://sgesys.com",
        },
      ],
    },
  ],
  contact: {
    email: "karl.sgesys@gmail.com",
    location: "Remote / Cabanatuan City, Nueva Ecija, Philippines",
  },
};

