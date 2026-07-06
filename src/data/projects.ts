/**
 * ---------------------------------------------------------------------------
 * PROJECTS
 *
 * `featured: true` projects (max 3) appear on the home page.
 * Every project gets its own page at /project/[slug].
 *
 * Body blocks support a tiny inline markdown subset:
 *   **bold**   `code`   [link text](https://url)
 * ---------------------------------------------------------------------------
 */

export type BodyBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string }
  | { type: "image"; alt: string; src?: string }
  | { type: "screenshots"; images: { alt: string; src?: string }[] };

export type Project = {
  slug: string;
  title: string;
  /** Short card / list description (1–2 sentences) */
  description: string;
  /** Longer one-liner shown under the title on the detail page */
  subtitle: string;
  year: string;
  role: string;
  /** e.g. "Jan 2025 – Present" or "ongoing" */
  period: string;
  /** Right-column date on /projects list */
  lastActive: string;
  tags: string[];
  /** Short accent labels shown on the card + detail header */
  badges?: string[];
  /** Optional external link rendered on the card ("↗ live") */
  liveUrl?: string;
  /** Optional file download rendered in the detail-page header */
  download?: { label: string; href: string };
  /** Optional interactive showcase rendered on the detail page */
  demo?: "transport" | "orchecomm" | "tspa";
  featured?: boolean;
  body: BodyBlock[];
};

export const projects: Project[] = [
  {
    slug: "orchecomm",
    title: "OrchEcomm: E-Commerce Orchestration Platform",
    description:
      "Modular operating system for online stores: 6 fully working modules (3 more in beta), connecting 30 businesses and 50+ suppliers while orchestrating 3.000+ orders every month.",
    subtitle:
      "Founder-built platform unifying sourcing, marketing, payments, support and more under one orchestration layer.",
    year: "2026",
    role: "Founder & Lead Developer",
    period: "Jan 2025 – Present",
    lastActive: "ongoing",
    tags: ["Next.js", "Node.js", "Stripe", "WooCommerce", "Shopify"],
    badges: ["Currently building", "Demo inside"],
    liveUrl: "https://orchecomm.nl",
    demo: "orchecomm",
    featured: true,
    body: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "OrchEcomm is a modular operating system for online stores that I designed and built from scratch. Store owners connect their shop once, then switch on only the modules they need (sourcing, marketing, payments, support and more) and let them work together as one orchestration. Today it runs **6 fully working modules with 3 more in full-scale development and beta testing**, connecting **30 e-commerce businesses** and **50+ suppliers** while orchestrating **3.000+ orders every month**.",
      },
      { type: "image", alt: "OrchEcomm dashboard", src: "/orchecomm-dashboard.jpg" },
      { type: "h2", text: "The Problem" },
      {
        type: "p",
        text: "Running a store today means running ten tools: a storefront here, payments there, marketing somewhere else, none of them talking to each other. Owners spend more time gluing tools together than growing their business, overlapping subscriptions stack up every month, and every tool reports a different number so there is no single source of truth.",
      },
      { type: "h2", text: "What I Built" },
      {
        type: "p",
        text: "The platform is architected as an **integrated ecosystem of independently deployable modules**, loosely coupled and glued together by a shared orchestration core. Every module reads and writes the same catalogue, brand and customer data, so there is no syncing and no silos. Merchants can adopt a single tool or the whole suite; either way everything shows up in one **centralized dashboard** that lets store owners configure, monitor, and extend all active modules from a single control plane.",
      },
      { type: "h2", text: "Key Features" },
      {
        type: "p",
        text: "**Automated visual content generation.** A content system synchronized with live product data, so store owners can produce consistent, on-brand marketing graphics without touching a design tool. Prices, names, and imagery stay in sync with the catalog automatically.",
      },
      {
        type: "p",
        text: "**Modular by design.** Every module is independently deployable and loosely coupled, sharing one orchestration core. That keeps the toolset accessible to non-technical store owners while remaining extensible for advanced use cases.",
      },
      { type: "h2", text: "Tech Stack" },
      {
        type: "ul",
        items: [
          "**Frontend**: Next.js, TypeScript, React",
          "**Backend**: Node.js (Express), Prisma ORM, Redis, WebSockets",
          "**Integrations**: Stripe API, WooCommerce API, Shopify API",
          "**Infrastructure**: Docker, GitLab CI/CD, VPS deployment",
        ],
      },
      { type: "h2", text: "Results & Impact" },
      {
        type: "ul",
        items: [
          "6 fully working modules, with 3 more in full-scale development and beta testing",
          "30 e-commerce businesses and 50+ suppliers connected to the platform",
          "3.000+ orders orchestrated every month across the network",
          "One dashboard replacing a patchwork of per-platform admin panels",
        ],
      },
    ],
  },
  {
    slug: "tspa-thesis",
    title: "TSPA: Detecting Coordinated Information Operations",
    description:
      "BSc thesis: a language-independent, platform-agnostic method linking accounts through the semantic and temporal proximity of their posts. Evaluated on 14 real campaigns, IO purities up to 100%.",
    subtitle:
      "Temporal Semantic Proximity Analysis: A Method for Detecting Coordinated Information Operations in Multilingual Social Media Data. BSc thesis, Maastricht University.",
    year: "2026",
    role: "BSc Thesis · Dept. of Advanced Computing Sciences",
    period: "2025 – 2026",
    lastActive: "Jun 2026",
    tags: ["Python", "NLP", "graph analysis", "research"],
    badges: ["Graded 8.5 / 10", "Interactive"],
    download: {
      label: "download thesis (PDF)",
      href: "/BCS_Thesis-Cristian-Teodor_Babalau.pdf",
    },
    demo: "tspa",
    featured: true,
    body: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "Coordinated information operations (IO) on social media are most commonly detected through platform-dependent behavioural traces such as shared retweets, URLs, or hashtags. But those signals vary across platforms and across the differing playbooks of state actors, and they overlook the core objective of an operation: **propagating a narrative**. My thesis argues that greater emphasis should be placed on **what is communicated and when**, rather than on *how* users interact.",
      },
      {
        type: "p",
        text: "The answer is **Temporal Semantic Proximity Analysis (TSPA)**: a language-independent, platform-agnostic method that links accounts solely through the semantic and temporal proximity of their posts, using multilingual sentence embeddings, sliding-window cosine similarity, and Leiden community detection. Written at Maastricht University's Department of Advanced Computing Sciences, supervised by Dr. Adriana Iamnitchi.",
      },
      { type: "h2", text: "Why It Matters" },
      {
        type: "p",
        text: "By the end of 2022, Meta reported disrupting **200+ global influence networks** originating in 68 countries and operating in at least 42 languages. False stories travel 70% further than true ones, and a 2023 UNESCO-Ipsos survey found 87% of respondents believe disinformation has already impacted their country's politics. Tools that flag coordinated inauthentic behaviour are how social media stays transparent, yet the behavioural signatures they rely on today don't transfer between platforms. Content does.",
      },
      { type: "h2", text: "The Data" },
      {
        type: "p",
        text: "Experiments run on a public labelled dataset of tweets from X (formerly Twitter) attributed to information operations across **16 distinct state actors**, from state governments (Russia, China, Iran) to sub-national political movements. I selected **14 campaigns** spanning diverse languages, durations, and IO concentration, from 7.057 tweets (Armenia) to **500.000 tweets** (China, Cuba), each paired with topically and temporally matched control accounts for objective evaluation.",
      },
      { type: "h2", text: "The Pipeline" },
      {
        type: "p",
        text: "Tweets are cleaned (mentions, URLs, retweet prefixes, and hashtags stripped), filtered, and encoded with the **paraphrase-multilingual-mpnet-base-v2** sentence transformer into 768-d vectors: a paraphrase-aware space where the same narrative, reworded or translated across 50+ languages, still lands close together. Within each calendar-aligned monthly window, the pipeline computes the full within-window similarity matrix **M = EEᵀ**.",
      },
      {
        type: "callout",
        text: "A full N×N similarity matrix at N = 100.000 tweets would eat up to 40 GB of RAM. TSPA slices the embedding matrix into row chunks and extracts each tweet's top-K neighbours with numpy.argpartition, O(N log K) per row instead of O(N log N), keeping campaign archives between 1.8 MB and 121 MB, computed on modest hardware.",
      },
      {
        type: "p",
        text: "Per-window similarity hits are collapsed into one score per account pair using three aggregation strategies: **maximum**, **average**, and **weighted** (a Bayesian-style shrinkage that suppresses spontaneous one-off matches while letting heavily-supported pairs converge to their empirical mean). Each campaign becomes a weighted user-to-user graph keeping every account's K′ strongest ties.",
      },
      { type: "h2", text: "From Similarity to Communities" },
      {
        type: "p",
        text: "On those graphs I run **weighted Leiden community detection**, chosen over Louvain for its guaranteed well-connected partitions on Twitter-scale networks. The results are striking: on the *Egypt_UAE* campaign the largest connected component resolves into clean clusters with **modularity Q ≈ 0.863** and **purity 0.929** against a 0.563 chance level. On *Russia_1*, one detected community groups 1.115 users of which **94% are IO accounts**, and a neighbouring cluster of 982 members reaches **100% intra-community IO purity**.",
      },
      { type: "h2", text: "TSPA vs. Behavioural Traces" },
      {
        type: "p",
        text: "I benchmarked TSPA against five classic behavioural traces (co-retweet, co-URL, hashtag sequences, co-mention, and fast retweet) plus their fused union, scoring accounts by **weighted eigenvector centrality** and comparing AUC-ROC. TSPA consistently separates IO–IO pairs from mixed pairs, and on several campaigns **matches or exceeds every individual behavioural trace**. Temporal semantic proximity works as a cross-platform backbone for surfacing coordinated communities, complementing rather than replacing behavioural approaches.",
      },
      { type: "h2", text: "Results & Impact" },
      {
        type: "ul",
        items: [
          "High-modularity communities with IO purities of up to **100%** across 14 real campaigns",
          "Matches or exceeds every individual behavioural trace on several campaigns (AUC-ROC)",
          "Language-independent and platform-agnostic: no retweet graphs or hashtags required",
          "500k-tweet campaigns processed on modest hardware via chunked BLAS + top-K extraction",
        ],
      },
      { type: "h2", text: "Tech Stack" },
      {
        type: "ul",
        items: [
          "**Core**: Python, NumPy, pandas, scikit-learn, SciPy",
          "**NLP & graphs**: sentence-transformers (MPNet), NetworkX, igraph, leidenalg",
          "**Presentation**: Jupyter, VIS-Network.js interactive dashboards, UMAP projections",
        ],
      },
    ],
  },
  {
    slug: "maastricht-transport-routing",
    title: "Maastricht Public Transport Routing",
    description:
      "Java routing engine for Maastricht's public transport built on GTFS data. A normalised MySQL schema and targeted indexes cut routing-query latency by 40%.",
    subtitle:
      "University project: a GTFS-based routing algorithm with a JavaFX interface, Dockerized and unit-tested.",
    year: "2025",
    role: "University Project",
    period: "2025",
    lastActive: "2025",
    tags: ["Java", "MySQL", "JavaFX", "Docker"],
    badges: ["Demo inside"],
    featured: true,
    demo: "transport",
    body: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "A **Java-based** public transport routing algorithm for Maastricht city using **GTFS data**, with a **JavaFX** interface to visualize optimal routes between locations. The **interactive demo above** is a simplified, browser-side re-creation of the router with placeholder data. The real engine runs on the full GTFS feed and a tuned MySQL schema.",
      },
      { type: "h2", text: "What I Built" },
      {
        type: "p",
        text: "A **database-driven solution with MySQL** to efficiently store and query public transport data. Restructuring and indexing the schema (normalised design plus targeted indexes on high-traffic columns) **cut routing-query latency by 40%**. SQL schemas were configured and managed specifically to optimize query performance for routing calculations.",
      },
      { type: "h2", text: "Engineering Practice" },
      {
        type: "ul",
        items: [
          "**Git workflows** with feature branches and pull-request reviews, deploying across dedicated test, acceptance, and production environments",
          "**Docker** containerization for consistent deployment across environments",
          "Comprehensive **unit testing with JUnit** (JaCoCo coverage) validating algorithm accuracy and performance",
        ],
      },
      { type: "h2", text: "Tech Stack" },
      {
        type: "ul",
        items: [
          "**Core**: Java JDK 21, Maven 3.6, Graphhopper Library",
          "**UI**: JavaFX",
          "**Data & infra**: MySQL, Docker, JUnit 5, JaCoCo, Git",
        ],
      },
    ],
  },
  {
    slug: "next-generation-sensors",
    title: "Sensor Data Platform · Next Generation Sensors",
    description:
      "Full-stack internship: RESTful APIs with Java Spring on PostgreSQL databases, a responsive Angular.js front end, and Agile team delivery. The backbone is still in production today.",
    subtitle:
      "Full-stack web development internship at Next Generation Sensors B.V., Maastricht.",
    year: "2023",
    role: "Full-Stack Web Developer Intern",
    period: "Oct 2023 – Feb 2024",
    lastActive: "Feb 2024",
    tags: ["Java Spring", "PostgreSQL", "Angular.js"],
    badges: ["In production to this day"],
    body: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "My first professional role: a full-stack web development internship at **Next Generation Sensors B.V.** in Maastricht, during the first year of my Computer Science degree. The backbone I helped build is still used by the company to this day.",
      },
      { type: "h2", text: "What I Built" },
      {
        type: "ul",
        items: [
          "Developed **RESTful APIs using the Java Spring** framework, integrating with **PostgreSQL databases**",
          "Built a responsive website using **Angular.js**, ensuring cross-browser compatibility and optimal performance",
          "Collaborated with the team using **Agile methodologies**, daily stand-ups and sprint planning",
        ],
      },
      { type: "h2", text: "Tech Stack" },
      {
        type: "ul",
        items: [
          "**Backend**: Java Spring, PostgreSQL",
          "**Frontend**: Angular.js",
          "**Process**: Agile, sprint planning, code reviews",
        ],
      },
    ],
  },
  {
    slug: "this-portfolio",
    title: "cristianbabalau.dev · This Portfolio",
    description:
      "Terminal-styled developer portfolio: Next.js 16 + Tailwind CSS v4, dark/light theming, a canned-answer chat terminal, shipped as a slim Docker image.",
    subtitle:
      "The site you're reading: terminal aesthetics, a chat that refuses to waste LLM credits, and a 197 MB Docker image.",
    year: "2026",
    role: "Full-Stack Developer",
    period: "Jul 2026 – Present",
    lastActive: "ongoing",
    tags: ["Next.js", "Tailwind", "Docker"],
    badges: ["You're looking at it"],
    body: [
      { type: "h2", text: "Overview" },
      {
        type: "p",
        text: "A terminal-styled portfolio built with **Next.js 16** and **Tailwind CSS v4**: dark/light theming, a mouse-torch dot background, filterable project and blog indexes, and the `~/ask-me.sh` chat widget on the home page.",
      },
      { type: "h2", text: "Notable Details" },
      {
        type: "ul",
        items: [
          "All personal content lives in typed data files, so the whole site re-renders from `src/data/`",
          "The chat terminal answers from a pre-generated pool keyed to my CV, at zero API cost, with instant replies",
          "Multi-stage Docker build producing a ~197 MB standalone image, running as a non-root user",
        ],
      },
      { type: "h2", text: "Tech Stack" },
      {
        type: "ul",
        items: [
          "**Frontend**: Next.js 16 (App Router), Tailwind CSS v4, TypeScript",
          "**Infrastructure**: Docker multi-stage build, standalone output",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
