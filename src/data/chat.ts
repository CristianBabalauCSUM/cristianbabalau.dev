/**
 * ---------------------------------------------------------------------------
 * CHAT Q&A POOL
 *
 * The ~/ask-me.sh widget answers exclusively from this pre-generated pool —
 * no LLM, no API costs. Each entry has:
 *   question  — shown as a clickable chip / list item
 *   keywords  — if a typed message contains any of these, this answer is used
 *   answer    — the canned reply (typed out terminal-style)
 *
 * Anything that doesn't match gets `fallbackReply` + the clickable question
 * list.
 * ---------------------------------------------------------------------------
 */
export type QA = {
  question: string;
  keywords: string[];
  answer: string;
};

export const qaPool: QA[] = [
  {
    question: "what is your stack?",
    keywords: ["stack", "technolog", "languages", "tools", "framework"],
    answer:
      "Day to day: Java (Spring Boot) and TypeScript (Next.js, Node/Express) with PostgreSQL, MySQL, MongoDB and Redis underneath. Python for research pipelines: NumPy, pandas, scikit-learn. Docker + GitLab CI/CD to ship it, JUnit + JaCoCo to keep it honest. And some C++ when the mood strikes.",
  },
  {
    question: "tell me about OrchEcomm",
    keywords: ["orchecomm", "ecommerce", "e-commerce", "shop", "merchant", "founder"],
    answer:
      "OrchEcomm is the e-commerce operating system I founded in January 2025: 6 fully working modules with 3 more in beta (sourcing, marketing, payments, support, website building, refunds), all under one centralized dashboard. It connects 30 businesses and 50+ suppliers, orchestrating 3.000+ orders every month. Think ZOHO's unified suite, but for e-commerce stacks. You can read more at orchecomm.nl.",
  },
  {
    question: "what's your thesis about?",
    keywords: ["thesis", "tspa", "research", "bots", "inauthentic", "twitter", "university"],
    answer:
      "Detecting coordinated information operations on social media via Temporal Semantic Proximity Analysis (TSPA): accounts that post the same meaning at the same time get flagged. Python pipeline, 500k tweets per campaign across 14 real influence operations, MPNet embeddings, Leiden community detection, surfacing coordinated communities with purities up to 100%. There's a full write-up on the blog, and the project page has a download link to the whole thesis.",
  },
  {
    question: "are you available for hire?",
    keywords: ["hire", "available", "job", "work", "freelance", "roles", "opportunit"],
    answer:
      "Yes, I hold a BSc in Computer Science from the University of Maastricht (class of 2026) and I'm open to roles and freelance work, currently focused on building OrchEcomm. Fastest routes: cristianbabalau2004@gmail.com or the contact form at the bottom of this page. I reply in < 24h.",
  },
  {
    question: "what experience do you have?",
    keywords: ["experience", "intern", "worked", "career", "background", "cv", "resume"],
    answer:
      "Full-stack intern at Next Generation Sensors B.V. (Oct 2023 to Feb 2024): Java Spring REST APIs on PostgreSQL, Angular.js front end, Agile team. Since January 2025: founder & lead developer of OrchEcomm, now 6 live modules (3 in beta), 30 businesses, 50+ suppliers, 3.000+ orders a month. Plus university projects like a GTFS-based transport routing engine that cut query latency 40% through MySQL schema design.",
  },
  {
    question: "where are you based?",
    keywords: ["based", "located", "location", "where", "live", "city", "country", "remote"],
    answer:
      "Maastricht, the Netherlands (GMT+1), where I earned my BSc in Computer Science. Fully remote-friendly; the ↔ in the tagline is load-bearing.",
  },
  {
    question: "how is this site built?",
    keywords: ["site", "portfolio", "website", "built", "made", "docker", "host"],
    answer:
      "Next.js 16 + Tailwind CSS v4, terminal aesthetic, dark/light theming, shipped as a ~197 MB standalone Docker image. This chat runs on a pre-generated answer pool keyed to my CV, so zero tokens were harmed in the making of this reply.",
  },
];

/** The edgy reply for questions outside the pool. */
export const fallbackReply =
  "sorry, LLM credits are expensive, and I don't feel like spending them on that one. BUT you might find your answer in one of these (100% credit-free):";

/**
 * Match a typed message against the pool: exact question match first,
 * then keyword scan. Returns undefined when nothing matches → fallback.
 */
export function findAnswer(input: string): QA | undefined {
  const normalized = input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim();
  if (!normalized) return undefined;

  const exact = qaPool.find(
    (qa) =>
      qa.question.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim() ===
      normalized
  );
  if (exact) return exact;

  return qaPool.find((qa) =>
    qa.keywords.some((kw) => normalized.includes(kw.toLowerCase()))
  );
}
