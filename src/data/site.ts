/**
 * ---------------------------------------------------------------------------
 * SITE CONFIG — single source of truth for personal details used across
 * the whole site (topbar, hero, contact, footer, metadata, …).
 * ---------------------------------------------------------------------------
 */
export const site = {
  /** First name / display name */
  name: "Cristian",
  /** Full name for metadata & structured data */
  fullName: "Cristian-Teodor Babalau",
  /** Short handle used for the logo + blog author chip */
  handle: "cristianbabalau",
  /** Domain shown in the logo, split as {handle}{domainSuffix} */
  domainSuffix: ".dev",
  /** Deployed URL (used for share links & metadata) */
  url: "https://cristianbabalau.dev",
  /** One-line role */
  tagline: "Software Engineer | Back-End & Architecture | Maastricht ↔ Remote",
  /** SEO title / description */
  metaTitle: "cristianbabalau.dev - Cristian-Teodor Babalau - Software Engineer",
  metaDescription:
    "Software engineering portfolio. Java Spring, Next.js, e-commerce infrastructure, and social-media research pipelines.",

  /** Availability pill in the hero */
  availability: {
    label: "AVAILABLE",
    note: "open to roles & freelance",
  },

  email: "cristianbabalau2004@gmail.com",
  github: {
    handle: "CristianBabalauCSUM",
    url: "https://github.com/CristianBabalauCSUM",
  },
  linkedin: {
    handle: "in/cristian-teodor-babalau",
    url: "https://www.linkedin.com/in/cristian-teodor-babalau-a587a4290/",
  },
  /** Optional scheduling link ("prefer a call?" button). Empty string hides it. */
  calendly: "",

  location: "Maastricht, NL · GMT+1",
  /** "status" row in the contact section */
  contactStatus: "accepting work · Q3 2026",
  /** "stack" row in the contact section */
  stackSummary: "Java / Spring / TS / Next.js",

  /** Footer left side */
  footerNote: "built fullstack, dockerized, self-hosted",
  copyrightYear: new Date().getFullYear(),
} as const;

/**
 * Hero intro paragraph. `em` chunks render in the accent color;
 * chunks with `href` render as accent links.
 */
export const heroIntro: { text: string; em?: boolean; href?: string }[] = [
  { text: "I build and ship " },
  { text: "production software end-to-end", em: true },
  {
    text: ": an e-commerce suite orchestrating thousands of orders a month, research pipelines crunching 500k tweets per campaign, and the dashboards on top of them. I graduated with a ",
  },
  { text: "BSc in Computer Science", em: true },
  {
    text: " from the University of Maastricht, and while I consider education very important, for now I've decided to focus on developing my own product and gaining experience from it. ",
  },
  { text: "OrchEcomm", em: true },
  {
    text: " is the project me and my team are working on and developing right now. More can be read ",
  },
  { text: "here", href: "/project/orchecomm" },
  { text: "." },
];
