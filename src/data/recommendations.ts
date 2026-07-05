/**
 * ---------------------------------------------------------------------------
 * RECOMMENDATIONS — replace placeholders with real references.
 * `avatar` is optional; without it an initials chip is shown.
 * ---------------------------------------------------------------------------
 */
export type Recommendation = {
  name: string;
  profileUrl: string;
  /** "github" | "linkedin" — controls the icon + "verified via …" line */
  via: "github" | "linkedin";
  /** e.g. "Jun 2026" */
  date: string;
  quote: string;
  avatar?: string;
};

export const recommendations: Recommendation[] = [
  {
    name: "[Colleague One]",
    profileUrl: "https://www.linkedin.com/in/colleague-one/",
    via: "linkedin",
    date: "[Mon YYYY]",
    quote:
      "“[A recommendation from someone you've worked with — a few sentences about what it was like to work together, what you're great at, and whether they'd recommend you.]”",
  },
  {
    name: "[Colleague Two]",
    profileUrl: "https://www.linkedin.com/in/colleague-two/",
    via: "linkedin",
    date: "[Mon YYYY]",
    quote:
      "“[A second recommendation — keep them short, real, and specific.]”",
  },
];

/** Intro copy for the /recommendations hero */
export const recommendationsIntro =
  "Real people, real words. Everyone here is a verified GitHub or LinkedIn contact I've worked alongside, collaborated with, or shipped something together.";
